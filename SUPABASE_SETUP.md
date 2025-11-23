# Supabase Setup Guide for Imtiaz Trading Platform

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: imtiaz-trading-platform
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to be ready

---

## Step 2: Run Database Migration

1. In your Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates all your tables:
- ✅ liquidity_providers
- ✅ accounts
- ✅ trades
- ✅ transactions
- ✅ balance_history

---

## Step 3: Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API** (left sidebar)
2. Copy these values (you'll need them later):

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Keep secret!)

3. Go to **Settings** → **Database** (left sidebar)
4. Scroll down to **Connection String** → **URI**
5. Copy the **Connection string** (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   Replace `[YOUR-PASSWORD]` with the database password you set in Step 1

---

## Step 4: Configure Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Optionally enable social providers (Google, GitHub, etc.)

### Email Templates (Optional but Recommended):

1. Go to **Authentication** → **Email Templates**
2. Customize confirmation and password reset emails with your branding

---

## Step 5: Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database (for direct PostgreSQL connection)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Backend Configuration
SECRET_KEY=your-secret-key-here-generate-with-openssl
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

To generate a SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Step 6: Install Dependencies

Update your `backend/requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Supabase
supabase==2.3.0
postgrest==0.13.2
```

Install:
```bash
cd backend
pip install -r requirements.txt
```

---

## Step 7: Test the Connection

Run the backend:
```bash
cd backend
uvicorn main:app --reload
```

Visit: http://localhost:8000/docs

You should see the FastAPI Swagger documentation.

---

## Step 8: Deploy Backend

### Option A: Render (Recommended)

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: imtiaz-trading-backend
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11
5. Add environment variables (from Step 5)
6. Click **"Create Web Service"**

### Option B: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` from backend directory
3. Add environment variables in Vercel dashboard

---

## Step 9: Deploy Frontend

1. Update frontend to use your backend API URL
2. Deploy to Vercel, Netlify, or Render
3. Update CORS_ORIGINS in backend .env to include frontend URL

---

## Database Schema Overview

### Tables Created:

1. **liquidity_providers** - LP configurations (MT5, REST API, WebSocket, etc.)
2. **accounts** - Trading accounts linked to LPs
3. **trades** - All trades (open and closed)
4. **transactions** - Deposits, withdrawals, transfers
5. **balance_history** - Account balance snapshots over time

### Security Features:

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only see/modify their own data
- ✅ Automatic `updated_at` timestamps
- ✅ UUID primary keys
- ✅ Foreign key constraints

---

## Testing

### Create a Test User:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Enter email and password
4. Click **"Create User"**
5. Copy the user's UUID

### Insert Demo Data:

Use the SQL Editor to run:
```sql
-- Replace 'YOUR_USER_ID' with the UUID from above
INSERT INTO liquidity_providers (user_id, name, api_type, login, password, server)
VALUES (
    'YOUR_USER_ID',
    'Demo MT5 Broker',
    'MT5',
    '12345678',
    'demo_password',
    'demo.server.com'
);
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ Authentication configured
3. ✅ Backend connected to Supabase
4. 🔄 Update frontend to use Supabase Auth
5. 🔄 Deploy backend and frontend
6. 🔄 Test end-to-end functionality

---

## Useful Supabase Features

- **Database** → **Tables**: View and edit data
- **Authentication** → **Users**: Manage users
- **SQL Editor**: Run custom queries
- **API Docs**: Auto-generated API documentation
- **Logs**: View database and API logs
- **Database** → **Backups**: Automatic daily backups (paid plans)

---

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- FastAPI Docs: https://fastapi.tiangolo.com

---

## Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY
- [ ] Enable 2FA on Supabase account
- [ ] Set up proper CORS origins (no wildcards)
- [ ] Review RLS policies
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Use service_role key only in backend (never in frontend)
- [ ] Use anon key in frontend (it's safe - RLS protects data)
