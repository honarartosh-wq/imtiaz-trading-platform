# Imtiaz Trading Platform - Quick Start Guide

This guide will help you set up and run the complete Imtiaz Trading Platform with both frontend and backend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - For the React frontend
- **Python** (v3.9 or higher) - For the FastAPI backend
- **PostgreSQL** (v12 or higher) - Database server
- **Git** - Version control

## 🚀 Quick Start (Development)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd imtiaz-trading-platform
```

### Step 2: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # macOS (using Homebrew)
   brew install postgresql@15
   brew services start postgresql@15

   # Windows
   # Download installer from https://www.postgresql.org/download/windows/
   ```

2. **Create Database and User**:
   ```bash
   # Access PostgreSQL
   sudo -u postgres psql

   # Or on Windows/macOS
   psql -U postgres

   # Run these commands in PostgreSQL shell:
   CREATE DATABASE imtiaz_trading;
   CREATE USER imtiaz_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE imtiaz_trading TO imtiaz_user;
   \q
   ```

### Step 3: Set Up Backend

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**:
   ```bash
   python -m venv venv

   # Activate virtual environment
   # On Linux/macOS:
   source venv/bin/activate

   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit .env file with your settings
   nano .env  # or use any text editor
   ```

   **Important settings in `.env`**:
   ```env
   DATABASE_URL=postgresql://imtiaz_user:your_secure_password@localhost:5432/imtiaz_trading
   SECRET_KEY=your-super-secret-key-min-32-characters-long
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ```

   **Generate a secure SECRET_KEY**:
   ```bash
   # Python command to generate secure key
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

5. **Initialize database with demo data**:
   ```bash
   python -m app.init_db
   ```

   This will create:
   - 3 branches (Main, Downtown, West) with referral codes
   - 4 demo users (Manager, Admin, Standard Client, Business Client)
   - 2 demo accounts with initial balances

6. **Start the backend server**:
   ```bash
   # Using the start script (recommended)
   chmod +x start.sh
   ./start.sh

   # Or start directly
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend API will be available at:
   - **API**: http://localhost:8000
   - **API Docs**: http://localhost:8000/docs
   - **ReDoc**: http://localhost:8000/redoc

### Step 4: Set Up Frontend

1. **Open a new terminal** and navigate to project root:
   ```bash
   cd /path/to/imtiaz-trading-platform
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure frontend environment**:
   ```bash
   # Copy example environment file
   cp .env.example .env

   # Edit if needed (default is localhost:8000)
   nano .env
   ```

   **Frontend `.env` settings**:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at:
   - **Frontend**: http://localhost:5173

### Step 5: Test the Application

1. **Open your browser** and navigate to http://localhost:5173

2. **Try the demo accounts**:

   | Role | Email | Password | Features |
   |------|-------|----------|----------|
   | Manager | manager@imtiaz.com | manager123 | Full platform management |
   | Admin | admin@imtiaz.com | admin123 | Branch administration |
   | Standard Client | client@example.com | client123 | Personal trading account |
   | Business Client | business@example.com | business123 | Corporate trading account |

3. **Test Registration**:
   - Click "Register" tab
   - Fill in the form
   - Select account type (Standard or Business)
   - Use one of the referral codes:
     - `MAIN001-REF` - Main Branch
     - `DT002-REF` - Downtown Branch
     - `WEST003-REF` - West Branch
   - Create your account
   - Login with your new credentials

## 🔍 Verify Backend API

Test the backend is working correctly:

```bash
# Health check
curl http://localhost:8000/

# Get API documentation
open http://localhost:8000/docs

# Test registration endpoint (example)
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "referral_code": "MAIN001-REF",
    "account_type": "standard"
  }'

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@imtiaz.com",
    "password": "manager123"
  }'
```

## 📁 Project Structure

```
imtiaz-trading-platform/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── middleware/      # Authentication middleware
│   │   ├── utils/           # Utility functions
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # Database setup
│   │   ├── main.py          # FastAPI app
│   │   └── init_db.py       # Database initialization
│   ├── venv/                # Python virtual environment (gitignored)
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (gitignored)
│   ├── .env.example         # Environment template
│   ├── start.sh             # Start script
│   ├── README.md            # Backend documentation
│   └── SETUP.md             # Detailed setup guide
├── src/                      # React frontend
│   ├── components/          # React components
│   │   ├── dashboards/      # Dashboard components
│   │   └── shared/          # Reusable UI components
│   ├── constants/           # Constants and enums
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   │   └── api.js           # Backend API client
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main App component
│   └── main.jsx             # React entry point
├── .env.example             # Frontend environment template
├── package.json             # Frontend dependencies
└── README.md                # Project documentation
```

## 🔧 Troubleshooting

### Backend Issues

**1. Database connection error**:
```
Error: could not connect to server
```
**Solution**: Ensure PostgreSQL is running
```bash
# Linux/macOS
sudo service postgresql start

# Or check status
sudo service postgresql status
```

**2. Module import errors**:
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Activate virtual environment and install dependencies
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**3. Port already in use**:
```
Error: [Errno 48] Address already in use
```
**Solution**: Kill the process using port 8000
```bash
# Find process
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Frontend Issues

**1. Cannot connect to backend**:
```
Network Error: Unable to connect to server
```
**Solution**:
- Ensure backend is running at http://localhost:8000
- Check VITE_API_BASE_URL in `.env`
- Check browser console for CORS errors

**2. Vite dev server port conflict**:
```
Port 5173 is already in use
```
**Solution**: Kill the process or use a different port
```bash
npm run dev -- --port 3000
```

**3. Module not found errors**:
```
Cannot find module 'axios'
```
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Security Notes

### Development Environment

The demo credentials are for **development and testing only**:

- Manager: manager@imtiaz.com / manager123
- Admin: admin@imtiaz.com / admin123
- Client: client@example.com / client123

### Production Deployment

Before deploying to production:

1. **Change the SECRET_KEY** in backend/.env to a strong random value
2. **Update DATABASE_URL** with production database credentials
3. **Remove or change demo user passwords** in init_db.py
4. **Enable HTTPS** for both frontend and backend
5. **Set proper CORS origins** in backend/app/config.py
6. **Use environment variables** for all sensitive data
7. **Enable rate limiting** on API endpoints
8. **Set up database backups**
9. **Configure logging** and monitoring
10. **Review and update** security headers

## 📚 Next Steps

Now that you have the platform running:

1. **Explore the API Documentation**: http://localhost:8000/docs
2. **Review Backend Code**: Check `backend/app/` for API implementation
3. **Test Trading Features**: Login as a client and explore the dashboard
4. **Integrate MetaTrader**: See backend/README.md for MetaTrader integration
5. **Customize the Platform**: Modify components in `src/components/`

## 🆘 Getting Help

- **Backend API Docs**: http://localhost:8000/docs
- **Backend Setup Guide**: See `backend/SETUP.md`
- **Backend README**: See `backend/README.md`
- **Frontend Components**: Check `src/components/shared/`

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]
