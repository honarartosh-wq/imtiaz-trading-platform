# Deployment Guide - Imtiaz Trading Platform

## ✅ Completed: Mobile App Setup

Your React app is now ready for iOS and Android! The following has been completed:

- ✅ Capacitor initialized with app ID: `com.imtiaz.trading`
- ✅ iOS platform added (`ios/` folder with Xcode project)
- ✅ Android platform added (`android/` folder with Android Studio project)
- ✅ Production build created (`dist/` folder)
- ✅ Web assets synced to native projects

## 📱 Testing Mobile Apps

### iOS (Requires Mac + Xcode)
```powershell
npx cap open ios
```
This opens your project in Xcode. Click the play button to run on iOS Simulator.

### Android (Requires Android Studio)
```powershell
npx cap open android
```
This opens your project in Android Studio. Click the run button to test on emulator.

### After Code Changes
```powershell
npm run build    # Rebuild web app
npx cap sync     # Sync changes to iOS/Android
```

---

## 🚀 Backend Deployment Options

**Current Issue**: Mobile apps need a cloud-hosted backend (not localhost:8000)

### Option 1: Railway (⭐ RECOMMENDED - Easiest & Cheapest)

**Cost**: $5/month includes app + PostgreSQL database  
**Why**: Built for FastAPI, automatic deployments, includes database, easiest setup

#### Step-by-Step Railway Setup:

1. **Sign up**: https://railway.app (use GitHub account)

2. **Install Railway CLI** (optional but helpful):
```powershell
npm install -g @railway/cli
```

3. **Prepare Your Backend**:

Create `backend/Procfile` (tells Railway how to start):
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Create `backend/runtime.txt` (specify Python version):
```
python-3.13
```

Update `backend/requirements.txt` - add PostgreSQL support:
```txt
# Add to existing requirements.txt:
psycopg2-binary==2.9.9
```

4. **Deploy via Railway Dashboard**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `imtiaz-trading-platform` repo
   - Set Root Directory: `backend`
   - Railway auto-detects Python and installs dependencies

5. **Add PostgreSQL Database**:
   - In project dashboard, click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

6. **Set Environment Variables** (in Railway dashboard):
```env
DATABASE_URL=postgresql://...  # Auto-set by Railway
SECRET_KEY=<generate new 32-char key>
CORS_ORIGINS=capacitor://localhost,http://localhost,https://<your-web-domain>
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

Generate SECRET_KEY:
```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

7. **Initialize Database** (run once):
```powershell
# In Railway dashboard, go to your service → Deployments
# Click on a deployment → Variables tab
# Copy DATABASE_URL, then in your local backend folder:

$env:DATABASE_URL = "postgresql://..." # Paste Railway DATABASE_URL
python -m app.init_db
```

8. **Get Your Production URL**:
   - Railway provides URL like: `https://your-app.railway.app`
   - Use this in your frontend API configuration

---

### Option 2: Azure App Service

**Cost**: $13-50/month  
**Best For**: If you need Windows stack or Azure ecosystem integration

#### Azure Setup:

1. **Install Azure CLI**:
```powershell
winget install Microsoft.AzureCLI
az login
```

2. **Create Resources**:
```powershell
# Create resource group
az group create --name imtiaz-trading-rg --location eastus

# Create PostgreSQL server
az postgres flexible-server create `
  --resource-group imtiaz-trading-rg `
  --name imtiaz-db `
  --location eastus `
  --admin-user imtiazadmin `
  --admin-password <YourPassword123!> `
  --sku-name Standard_B1ms

# Create App Service plan (Linux)
az appservice plan create `
  --name imtiaz-plan `
  --resource-group imtiaz-trading-rg `
  --sku B1 `
  --is-linux

# Create Web App
az webapp create `
  --resource-group imtiaz-trading-rg `
  --plan imtiaz-plan `
  --name imtiaz-trading-api `
  --runtime "PYTHON:3.13"
```

3. **Deploy Backend**:
```powershell
cd backend
az webapp up `
  --name imtiaz-trading-api `
  --resource-group imtiaz-trading-rg `
  --runtime "PYTHON:3.13"
```

4. **Configure Environment Variables**:
```powershell
az webapp config appsettings set `
  --resource-group imtiaz-trading-rg `
  --name imtiaz-trading-api `
  --settings `
    DATABASE_URL="postgresql://..." `
    SECRET_KEY="<your-key>" `
    CORS_ORIGINS="capacitor://localhost,http://localhost"
```

---

### Option 3: AWS Elastic Beanstalk

**Cost**: $10-40/month  
**Best For**: High scalability needs, AWS ecosystem

#### AWS Setup:

1. **Install EB CLI**:
```powershell
pip install awsebcli
```

2. **Initialize EB Application**:
```powershell
cd backend
eb init -p python-3.13 imtiaz-trading
```

3. **Create Environment**:
```powershell
eb create imtiaz-prod --database
```

4. **Deploy**:
```powershell
eb deploy
```

5. **Set Environment Variables**:
```powershell
eb setenv SECRET_KEY=<key> CORS_ORIGINS=capacitor://localhost
```

---

## 📱 Update Frontend API Configuration

After deploying backend, update your frontend to use production URL:

### In `src/services/api.js`:

**Current** (localhost):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

**Update** (production):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-app.railway.app';
```

**Or** create `.env` file in project root:
```env
VITE_API_BASE_URL=https://your-app.railway.app
```

### Rebuild After Changing API URL:
```powershell
npm run build    # Rebuild with new API URL
npx cap sync     # Update native apps
```

---

## 🔒 Important: CORS Configuration

Your backend needs to allow requests from mobile apps. Update `backend/.env`:

```env
# For Capacitor mobile apps + web
CORS_ORIGINS=capacitor://localhost,http://localhost,ionic://localhost,https://localhost,https://your-domain.com
```

Or update `backend/app/main.py` directly:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "capacitor://localhost",
        "http://localhost",
        "http://localhost:5173",
        "ionic://localhost",
        "https://your-domain.com"  # Add your production web domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Testing Checklist

After deployment:

- [ ] Backend accessible at production URL (https://your-app.railway.app/docs)
- [ ] Frontend `.env` updated with production API URL
- [ ] `npm run build` completed successfully
- [ ] `npx cap sync` synced changes to mobile apps
- [ ] Web app can login (test in browser)
- [ ] iOS app can login (test in Xcode simulator)
- [ ] Android app can login (test in Android Studio emulator)
- [ ] Client position tracking works on mobile
- [ ] $5 liquidation alerts display correctly

---

## 📊 Database Migration (SQLite → PostgreSQL)

Your current database is SQLite (`imtiaz_trading.db`). For production, use PostgreSQL.

### Railway Auto-Migration:
Railway PostgreSQL is automatically configured. Just run:
```powershell
# Set DATABASE_URL from Railway
$env:DATABASE_URL = "postgresql://..." 

# Run init script to create tables and demo data
python -m app.init_db
```

### Manual PostgreSQL Setup:
If using Azure/AWS, update `backend/.env`:
```env
# Replace SQLite:
# DATABASE_URL=sqlite:///./imtiaz_trading.db

# With PostgreSQL:
DATABASE_URL=postgresql://user:password@host:5432/imtiaz_trading
```

Then run:
```powershell
cd backend
python -m app.init_db
```

---

## 🌐 Web App Deployment (Optional)

Your web app can also be deployed separately:

### Vercel (Free Tier Available):
```powershell
npm install -g vercel
vercel --prod
```

### Netlify (Free Tier Available):
```powershell
npm install -g netlify-cli
netlify deploy --prod
```

Both auto-detect Vite build configuration and deploy your `dist` folder.

---

## 🎯 Recommended Next Steps

1. **Deploy Backend to Railway** (easiest option):
   - Sign up at https://railway.app
   - Connect GitHub repo
   - Add PostgreSQL database
   - Set environment variables
   - Get production URL

2. **Update Frontend API URL**:
   - Create `.env` with Railway URL
   - Rebuild: `npm run build`
   - Sync: `npx cap sync`

3. **Test Mobile Apps**:
   - iOS: `npx cap open ios` (requires Mac)
   - Android: `npx cap open android`
   - Login and test features

4. **Optional - Deploy Web App**:
   - Use Vercel or Netlify for free hosting
   - Your app will be available on web + iOS + Android

---

## ❓ Need Help?

- **Railway Docs**: https://docs.railway.app/guides/fastapi
- **Capacitor Docs**: https://capacitorjs.com/docs
- **Azure Python Docs**: https://learn.microsoft.com/azure/app-service/quickstart-python
- **AWS EB Docs**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-apps.html

---

## 🚨 Security Reminders

- [ ] Change SECRET_KEY for production (don't reuse development key)
- [ ] Update CORS_ORIGINS to include only your domains
- [ ] Use strong database password
- [ ] Enable HTTPS (Railway/Azure/AWS provide this automatically)
- [ ] Don't commit `.env` files to git (already in `.gitignore`)
