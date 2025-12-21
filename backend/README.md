# Imtiaz Trading Platform - Backend API

FastAPI backend with PostgreSQL database and MetaTrader 5 integration.

## Features

- 🔐 JWT Authentication
- 👥 User Management (Manager, Admin, Client roles)
- 🏦 Account Management
- 💰 Wallet & Transactions
- 📊 Trading Operations
- 🔄 MetaTrader 5 Integration
- 🌐 Real-time WebSocket Support
- 📈 Transaction History & Analytics

## Tech Stack

- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **Migrations:** Alembic
- **Cache:** Redis
- **MetaTrader:** MetaTrader5 Python Library

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

```bash
# Install PostgreSQL
# On Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE imtiaz_trading;
CREATE USER imtiaz_user WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE imtiaz_trading TO imtiaz_user;
\q
```

### 3. Setup Redis (Optional but recommended)

```bash
# On Ubuntu/Debian:
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

#### Required Environment Variables

**Critical Security Settings:**
- `SECRET_KEY`: JWT secret key for signing tokens
  - **MUST be at least 32 characters**
  - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
  - Never reuse or share this key
  
- `ADMIN_EMAIL`: Email for the initial admin account
  - Used during database initialization
  
- `ADMIN_PASSWORD`: Password for the initial admin account
  - **MUST be at least 8 characters** (12+ recommended)
  - Should include uppercase, lowercase, numbers, and special characters
  - Generate strong password with: `python -c "import secrets; import string; chars = string.ascii_letters + string.digits + string.punctuation; print(''.join(secrets.choice(chars) for _ in range(16)))"`

**Database Configuration:**
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  
- `DB_POOL_SIZE`: Number of connections to maintain (default: 20)
- `DB_MAX_OVERFLOW`: Maximum overflow connections (default: 10)
- `DB_POOL_TIMEOUT`: Connection timeout in seconds (default: 30)
- `DB_POOL_RECYCLE`: Time before recycling connections in seconds (default: 3600)

**Optional Settings:**
- `REDIS_URL`: Redis connection string (recommended for production)
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs
- `DEBUG`: Set to `false` in production
- MetaTrader credentials (if using MT5 integration)

**Security Best Practices:**
1. Never commit the `.env` file to version control
2. Use different credentials for development and production
3. Rotate secrets regularly (at least every 90 days)
4. Use strong, unique passwords for all accounts
5. Enable DEBUG=false in production

### 5. Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 6. Run the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using the script
python -m app.main
```

The API will be available at: http://localhost:8000

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info

### Accounts (Coming soon)
- `GET /api/accounts` - Get user accounts
- `GET /api/accounts/{id}` - Get account details
- `POST /api/accounts/deposit` - Deposit funds
- `POST /api/accounts/withdraw` - Withdraw funds

### Transactions (Coming soon)
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions/transfer` - Transfer funds

### Trading (Coming soon)
- `GET /api/trades` - Get user trades
- `POST /api/trades/open` - Open new trade
- `POST /api/trades/close` - Close existing trade
- `GET /api/prices/live` - WebSocket for live prices

## Database Schema

### Tables
1. **users** - User accounts (Manager, Admin, Client)
2. **branches** - Trading branches
3. **accounts** - Trading accounts
4. **transactions** - Financial transactions
5. **trades** - Trading positions

## MetaTrader Integration

To integrate with MetaTrader 5:

1. Install MT5 terminal
2. Configure MT5 credentials in `.env`
3. The backend will:
   - Fetch live price feeds
   - Execute trades through MT5
   - Sync account balances
   - Manage positions

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS configuration
- ✅ Input validation (Pydantic)

## Development

### Project Structure

```
backend/
├── app/
│   ├── api/            # API endpoints
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── middleware/     # Auth & middleware
│   ├── utils/          # Utilities
│   ├── config.py       # Configuration
│   ├── database.py     # Database connection
│   └── main.py         # FastAPI app
├── migrations/         # Alembic migrations
├── tests/             # Unit tests
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

### Adding New Endpoints

1. Create route in `app/api/`
2. Define schemas in `app/schemas/`
3. Add business logic in `app/services/`
4. Register router in `app/main.py`

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app tests/
```

## Deployment

### Using Docker

```bash
# Build image
docker build -t imtiaz-backend .

# Run container
docker run -p 8000:8000 --env-file .env imtiaz-backend
```

### Using Gunicorn (Production)

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## License

Proprietary - Imtiaz Trading Platform

## Support

For issues or questions, contact the development team.
