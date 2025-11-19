# Backend Setup Guide

Complete setup instructions for Imtiaz Trading Platform backend.

## Quick Start

```bash
cd backend

# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup PostgreSQL database
sudo -u postgres psql
CREATE DATABASE imtiaz_trading;
CREATE USER imtiaz_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE imtiaz_trading TO imtiaz_user;
\q

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Initialize database with demo data
python -m app.init_db

# 6. Start the server
./start.sh
# Or: uvicorn app.main:app --reload
```

## Detailed Setup

### 1. System Requirements

- Python 3.9+
- PostgreSQL 12+
- Redis 6+ (optional, for caching)
- 2GB RAM minimum
- MetaTrader 5 (for trading integration)

### 2. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 3. Install Redis (Optional)

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**macOS:**
```bash
brew install redis
brew services start redis
```

### 4. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Run these commands:
CREATE DATABASE imtiaz_trading;
CREATE USER imtiaz_user WITH ENCRYPTED PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE imtiaz_trading TO imtiaz_user;

# Grant additional permissions
\c imtiaz_trading
GRANT ALL ON SCHEMA public TO imtiaz_user;

# Exit
\q
```

### 5. Configure Environment Variables

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

**Required Settings:**
```env
DATABASE_URL=postgresql://imtiaz_user:your_password@localhost:5432/imtiaz_trading
SECRET_KEY=generate-with-openssl-rand-hex-32
```

**Generate SECRET_KEY:**
```bash
openssl rand -hex 32
```

### 6. Install Python Dependencies

```bash
# Activate virtual environment
source venv/bin/activate

# Install packages
pip install --upgrade pip
pip install -r requirements.txt
```

### 7. Initialize Database

```bash
python -m app.init_db
```

This will create:
- ✅ All database tables
- ✅ 3 branches with referral codes
- ✅ 4 demo users (Manager, Admin, 2 Clients)
- ✅ 2 client accounts with demo balances

### 8. Start the Server

**Development mode:**
```bash
./start.sh
```

**Or manually:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 9. Verify Installation

Open your browser:
- **API Root:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Try the `/health` endpoint:
```bash
curl http://localhost:8000/health
```

### 10. Test API

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "phone": "+1234567890",
    "referral_code": "MAIN001-REF",
    "account_type": "standard"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "client123"
  }'
```

## Troubleshooting

### Database Connection Error

**Error:** `could not connect to server`

**Solution:**
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env`
3. Ensure database user has permissions

### Import Errors

**Error:** `ModuleNotFoundError`

**Solution:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Find and kill process using port 8000
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Permission Denied on start.sh

**Solution:**
```bash
chmod +x start.sh
```

## MetaTrader Integration (Optional)

To enable MetaTrader 5 integration:

1. Install MT5 terminal
2. Configure in `.env`:
```env
MT5_SERVER=your-server.com
MT5_LOGIN=your_login
MT5_PASSWORD=your_password
```

3. Restart the backend

## Database Migrations

When you modify models:

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Backup Database

```bash
pg_dump -U imtiaz_user imtiaz_trading > backup.sql
```

## Restore Database

```bash
psql -U imtiaz_user imtiaz_trading < backup.sql
```

## Production Deployment

See `README.md` for Docker and production deployment instructions.

## Support

For issues, check:
1. Logs: Check terminal output
2. Database: `psql -U imtiaz_user imtiaz_trading`
3. Environment: Verify `.env` settings

## Demo Credentials

After initialization:

**Manager:**
- Email: manager@imtiaz.com
- Password: manager123

**Admin:**
- Email: admin@imtiaz.com
- Password: admin123

**Standard Client:**
- Email: client@example.com
- Password: client123

**Business Client:**
- Email: business@example.com
- Password: business123

**Branch Codes:**
- MAIN001-REF - Main Branch
- DT002-REF - Downtown Branch
- WEST003-REF - West Branch
