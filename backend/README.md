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

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key (generate with: `openssl rand -hex 32`)
- `REDIS_URL`: Redis connection string
- MetaTrader credentials (if using MT integration)

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
