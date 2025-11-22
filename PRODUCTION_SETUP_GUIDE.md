# Imtiaz Trading Platform - Production Deployment Guide

## 🚀 Complete Production Setup (Step-by-Step)

Follow this guide to deploy your trading platform to production on Railway.

---

## 📋 Prerequisites

- [ ] Railway account (free tier works fine)
- [ ] GitHub repository with latest code
- [ ] 30 minutes of time

---

## Step 1: Set Up Railway PostgreSQL Database

### 1.1 Create Database

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Click **"Provision PostgreSQL"**
4. Wait for database to provision (1-2 minutes)

### 1.2 Get Database Connection String

1. Click on the **PostgreSQL** service
2. Go to **"Variables"** tab
3. Find and copy `DATABASE_URL`
   - It looks like: `postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:xxxx/railway`
4. Save this for later ✅

---

## Step 2: Deploy Backend API

### 2.1 Create Backend Service

1. In same Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose your repository: `imtiaz-trading-platform`
4. Click **"Deploy"**

### 2.2 Configure Backend Root Directory

1. Go to **"Settings"** tab
2. Find **"Root Directory"**
3. Set to: `/backend`
4. Click **"Save"**

### 2.3 Add Backend Environment Variables

Go to **"Variables"** tab and add these:

```bash
# Database (paste the URL from Step 1.2)
DATABASE_URL=postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:xxxx/railway

# Security (generate new key)
SECRET_KEY=generate-this-with-command-below

# CORS (we'll update this after frontend deploys)
CORS_ORIGINS=http://localhost:3000

# App Settings
DEBUG=False
APP_NAME=Imtiaz Trading Platform
APP_VERSION=1.0.0
HOST=0.0.0.0
```

**Generate SECRET_KEY:**
```bash
# Run this locally or use: https://www.random.org/strings/
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.4 Get Backend URL

1. Go to **"Settings"** → **"Domains"**
2. Copy the Railway-provided URL
   - Example: `backend-production-abc123.up.railway.app`
3. Save this for later ✅

---

## Step 3: Deploy Frontend

### 3.1 Create Frontend Service

1. In same Railway project, click **"+ New"**
2. Select **"GitHub Repo"** (same repo)
3. Choose your repository again
4. Click **"Deploy"**

### 3.2 Configure Frontend Root Directory

1. Go to **"Settings"** tab
2. **Root Directory**: Leave as `/` (root)
3. Click **"Save"**

### 3.3 Add Frontend Environment Variables

Go to **"Variables"** tab and add:

```bash
# Backend API URL (paste from Step 2.4)
VITE_API_BASE_URL=https://backend-production-abc123.up.railway.app

# Environment
VITE_ENV=production
```

### 3.4 Get Frontend URL

1. Go to **"Settings"** → **"Domains"**
2. Copy the Railway-provided URL
   - You said yours is: `imtiaz-trading-platform-production.up.railway.app`
3. Save this ✅

---

## Step 4: Update Backend CORS

Now that we have the frontend URL, update backend CORS:

1. Go back to **Backend service**
2. Go to **"Variables"** tab
3. Find `CORS_ORIGINS`
4. Update to your frontend URL:

```bash
CORS_ORIGINS=https://imtiaz-trading-platform-production.up.railway.app
```

5. Backend will automatically redeploy

---

## Step 5: Initialize Database

### 5.1 Wait for Backend Deployment

1. Go to **Backend service**
2. Check **"Deployments"** tab
3. Wait until status is **"Success"** ✅

### 5.2 Create Database Tables

Your backend automatically creates tables on startup! Check logs:

1. Go to Backend → **"Deployments"**
2. Click latest deployment
3. Look for logs showing table creation

### 5.3 Seed Demo Data (Optional)

Option A: Use the API endpoint
```bash
curl -X POST https://your-backend-url.railway.app/api/init-database
```

Option B: Use Railway CLI
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Run: `railway run -s backend python -c "from app.init_db import init_db; init_db()"`

---

## Step 6: Test Your Production Deployment

### 6.1 Test Backend API

Open in browser:
```
https://your-backend-url.railway.app/health
```

Expected response:
```json
{"status": "healthy"}
```

### 6.2 Test Frontend

Open in browser:
```
https://imtiaz-trading-platform-production.up.railway.app
```

You should see your trading platform login page!

### 6.3 Test Login

Try demo credentials:
- **Manager**: `manager@imtiaz.com` / `manager123`
- **Admin**: `admin@imtiaz.com` / `admin123`
- **Client**: `client@example.com` / `client123`

---

## 🎯 Your Production Architecture

```
┌─────────────────────────────────────────┐
│         Railway Project                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌─────────────┐    │
│  │  PostgreSQL  │  │   Backend   │    │
│  │   Database   │←─│  FastAPI    │    │
│  └──────────────┘  └─────────────┘    │
│                           ↑             │
│                           │             │
│                    ┌─────────────┐     │
│                    │  Frontend   │     │
│                    │ React + Vite│     │
│                    └─────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Production Checklist

- [ ] PostgreSQL database created
- [ ] Backend deployed with correct environment variables
- [ ] Frontend deployed with API URL
- [ ] CORS configured with frontend URL
- [ ] Database tables auto-created
- [ ] `/health` endpoint returns success
- [ ] Frontend loads without errors
- [ ] Login works with demo credentials
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### Backend won't deploy
- Check **"Logs"** tab for errors
- Verify `DATABASE_URL` is correct
- Make sure root directory is `/backend`

### Frontend can't connect to backend
- Check `VITE_API_BASE_URL` has correct backend URL
- Verify CORS_ORIGINS matches frontend URL exactly
- Check browser console for errors

### Database connection fails
- Verify `DATABASE_URL` from PostgreSQL service
- Check PostgreSQL service is running

### CORS errors
```
Access to fetch at 'https://backend...' from origin 'https://frontend...'
has been blocked by CORS policy
```
- Update backend `CORS_ORIGINS` to match frontend URL exactly
- Include `https://` prefix
- No trailing slash

---

## 🔐 Security Checklist (Important!)

- [ ] `SECRET_KEY` is unique and secure (not default)
- [ ] `DEBUG=False` in production
- [ ] Using PostgreSQL (not SQLite)
- [ ] CORS only allows your frontend domain
- [ ] Remove `/api/init-database` endpoint after seeding (security risk)

---

## 📊 What Gets Deployed

### Backend (FastAPI)
- ✅ REST API endpoints
- ✅ Authentication system
- ✅ Database models (User, Branch, Account, Trade, Transaction)
- ✅ Auto-creates tables on startup

### Frontend (React + Vite)
- ✅ Trading platform UI
- ✅ Manager, Admin, Client dashboards
- ✅ Modern design system
- ✅ Mobile responsive

---

## 🎓 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add your domain in Railway Settings → Domains
   - Update DNS records as instructed

2. **Monitoring**
   - Set up Railway metrics
   - Monitor usage and errors

3. **Backup**
   - Railway auto-backs up PostgreSQL
   - Consider additional backup strategy

4. **Scale** (if needed)
   - Upgrade Railway plan for more resources
   - Add read replicas for database

---

## 📞 Need Help?

If you get stuck:
1. Check Railway logs (Deployments → View Logs)
2. Check browser console (F12)
3. Verify all environment variables
4. Ask me for help! 🚀

---

**Ready to start?** Let's begin with Step 1! 🎯
