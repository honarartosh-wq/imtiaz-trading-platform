# Imtiaz Trading Platform - AI Coding Agent Guide

## Quick Start

**Backend:** `cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python -m app.init_db && uvicorn app.main:app --reload --port 8000`

**Frontend:** `npm install && npm run dev` (runs on localhost:5173)

**Critical First Step:** Run `python -m app.init_db` before anything else - creates branches with referral codes that registration flow requires.

## System Architecture

**3-tier role system** with branch-based hierarchy:
- **Manager** → Platform-wide access (no branch)
- **Admin** → Branch-scoped with referral codes (`MAIN001-REF`)
- **Client** → Two types: `standard` (personal) or `business` (corporate)

**Registration data flow (non-obvious):**
```
User submits → Validate referral_code in branches table → Generate account_number
→ Create User (role=CLIENT) → Create linked Account with branch.leverage
→ Return UserResponse (NO tokens - user must login separately)
```

**Auth data mismatch (requires mapping):**
- Backend: `role` field stores uppercase enum (`"MANAGER"`, `"ADMIN"`, `"CLIENT"`)
- Frontend: Expects lowercase `type` (`"manager"`, `"admin"`, `"client"`)
- Always transform: `type: userData.role.toLowerCase()` in App.jsx

## Backend Patterns (FastAPI)

### Auth Dependencies (Use These, Don't Reinvent)
```python
# In route functions - inject these from backend/app/middleware/auth.py:
current_user: User = Depends(get_current_user)  # Any authenticated user
current_user: User = Depends(require_role("manager"))  # Single role
current_user: User = Depends(require_roles("admin", "manager"))  # Multiple roles
```

### Database Operations (Always Follow This Pattern)
```python
db: Session = Depends(get_db)
try:
    obj = SomeModel(...)
    db.add(obj)
    db.commit()
    db.refresh(obj)  # Get DB-generated fields like id, timestamps
    return obj
except Exception as e:
    db.rollback()  # CRITICAL - prevents partial writes
    raise HTTPException(...)
```

### Account Number Generation (Use Existing Function)
```python
from app.utils.security import generate_account_number
account_number = generate_account_number()  # Returns "ACC-20251120-xxxxx"
# NOTE: Format is ACC-{YYYYMMDD}-{5-random-digits}
```

### Model Relationships (Bidirectional Pattern)
```python
# In User model:
accounts = relationship("Account", back_populates="user")
# In Account model:
user = relationship("User", back_populates="accounts")
```

## Frontend Patterns (React)

### API Calls (ALWAYS Use Centralized Service)
**Don't:** Call axios directly in components  
**Do:** Add function to `src/services/api.js` and import it
```javascript
// In api.js:
export const someAction = async (data) => {
  const response = await api.post('/api/resource', data);
  return response.data;
};
// In component:
import { someAction } from '../services/api';
const result = await someAction(data);
```

### Token Refresh (Don't Touch This)
`src/services/api.js` has axios interceptor that auto-refreshes tokens on 401. **Never implement manual token refresh logic.**

### Validation Pattern (Consistent Return Format)
All validators in `src/utils/validation.js` return `{ isValid: boolean, error: string }`:
```javascript
const validation = validateEmail(email);
if (!validation.isValid) {
  toast.error(validation.error);
  return;
}
```

### Shared Components (Pre-built, Use These)
```javascript
<Button variant="primary|secondary|danger|success|warning" size="sm|md|lg" />
<Input type="..." value={...} onChange={...} error={errorMsg} />
<Modal isOpen={...} onClose={...} title="...">content</Modal>
```

### Dashboard Tab Pattern (All Use Same Structure)
```javascript
const [activeTab, setActiveTab] = useState('overview');
// Tabs: 'overview', 'users', 'accounts', 'transactions', etc.
```

## Critical Non-Obvious Details

1. **Branch referral codes are UNIQUE constraint** - Registration fails if code doesn't exist in `branches.referral_code`

2. **User.account_number is denormalized** - Stored in BOTH `users.account_number` AND `accounts.account_number` for fast queries

3. **Enums must match between Python/JS:**
   - Backend: `UserRole.CLIENT`, `AccountType.STANDARD` (uppercase enum values)
   - Frontend: `USER_ROLES.CLIENT`, `ACCOUNT_TYPES.STANDARD` (lowercase string values in constants/trading.js)

4. **CORS origins must be comma-separated string** - In backend `.env`: `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`

5. **Login returns tokens, register does NOT** - Registration only creates user, client must call `/api/auth/login` separately

6. **Account has 3 balance fields:**
   - `balance` (total = wallet + trading)
   - `wallet_balance` (available for withdrawal)
   - `trading_balance` (locked in open positions)

7. **Timestamps use server_default** - Never set created_at manually: `created_at = Column(DateTime, server_default=func.now())`

## Adding New Features

**New API endpoint checklist:**
1. Create Pydantic schema in `backend/app/schemas/{resource}.py` with Field validators
2. Create route in `backend/app/api/{resource}.py` with auth dependency
3. Register router in `backend/app/main.py`: `app.include_router(resource.router, prefix="/api")`
4. Add API function in `src/services/api.js` with error handling
5. Test at http://localhost:8000/docs (Swagger auto-generated)

**New database model checklist:**
1. Create model in `backend/app/models/{resource}.py` inheriting from `Base`
2. Import in `backend/app/models/__init__.py`
3. Restart server (triggers `Base.metadata.create_all()`) OR run Alembic migration
4. Update `init_db.py` if demo data needed

## Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/imtiaz_trading
SECRET_KEY=<32-char-random>  # python -c "import secrets; print(secrets.token_urlsafe(32))"
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Demo Credentials

```
Manager:  manager@imtiaz.com  / manager123
Admin:    admin@imtiaz.com    / admin123
Client:   client@example.com  / client123
Business: business@example.com / business123

Branch Codes for Registration:
MAIN001-REF | DT002-REF | WEST003-REF
```

## Common Errors & Fixes

**"Invalid referral code"** → Run `python -m app.init_db` to create branches  
**CORS error** → Add frontend URL to `CORS_ORIGINS` in backend/.env  
**Token expired** → Interceptor handles this - check console for refresh errors  
**"could not validate credentials"** → Token missing/invalid - user needs to login  
**Database session closed** → Missing `db.commit()` or using object after session closed
