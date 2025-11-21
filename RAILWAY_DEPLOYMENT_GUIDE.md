# Railway Deployment Guide - Imtiaz Trading Platform

This guide will help you deploy the Imtiaz Trading Platform on Railway.

## 🚀 Quick Deploy

### Option 1: Deploy Frontend (Recommended)

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Create New Project** → **Deploy from GitHub repo**
3. **Select Repository**: `imtiaz-trading-platform`
4. **Select Branch**: `claude/repair-code-files-019M4ixFgWaaKF4KhKUkBQgT`

Railway will automatically detect the configuration from `railway.json` and `nixpacks.toml`.

### Option 2: Deploy Backend (Python/FastAPI)

1. **Create New Service** in Railway
2. **Select Repository**: `imtiaz-trading-platform`
3. **Settings**:
   - **Root Directory**: `/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## 📋 Configuration Files

We've added these files to ensure smooth Railway deployment:

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build:prod"
  },
  "deploy": {
    "startCommand": "npx serve dist -l $PORT"
  }
}
```

### `nixpacks.toml`
```toml
providers = ["node"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build:prod"]

[start]
cmd = "npx serve dist -l $PORT"
```

---

## 🔧 Manual Configuration (If Needed)

If Railway doesn't auto-detect, configure manually:

### Frontend Deployment

**Service Settings:**
- **Builder**: Nixpacks
- **Build Command**: `npm ci && npm run build:prod`
- **Start Command**: `npm start` or `npx serve dist -l $PORT`
- **Install Command**: `npm ci`

**Environment Variables:**
- `NODE_VERSION`: `20`
- `NPM_VERSION`: `9`
- `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)

### Backend Deployment

**Service Settings:**
- **Root Directory**: `/backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Python Version**: `3.11` or higher

**Environment Variables:**
```
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://user:pass@host/db
CORS_ORIGINS=https://your-frontend.railway.app
DEBUG=False
```

---

## 🐛 Troubleshooting

### Issue 1: "npm ci failed - packages out of sync"

**Solution**: Make sure you've pulled the latest commits that include the updated `package-lock.json`.

```bash
git pull origin claude/repair-code-files-019M4ixFgWaaKF4KhKUkBQgT
```

### Issue 2: "terser not found"

**Solution**: This is fixed in the latest commits. Pull the latest changes.

### Issue 3: Build succeeds but app doesn't start

**Check**:
1. Railway is using the correct start command: `npm start`
2. The `PORT` environment variable is available
3. Check Railway logs for errors

### Issue 4: "Cannot find module 'serve'"

**Solution**: Make sure `serve` is in dependencies (not devDependencies). It's already fixed in latest commit.

### Issue 5: Frontend can't connect to backend

**Check**:
1. Backend is deployed and running
2. `VITE_API_BASE_URL` is set correctly in frontend environment variables
3. CORS is configured in backend to allow frontend domain

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] Latest code is pushed to GitHub
- [ ] `package-lock.json` is committed (not in .gitignore)
- [ ] All dependencies are in `package.json`
- [ ] Environment variables are configured
- [ ] Backend is deployed first (if needed)
- [ ] Frontend `VITE_API_BASE_URL` points to backend

---

## 🔄 Redeploying

If deployment fails:

1. **Check Railway Logs**:
   - Go to your service
   - Click "Deployments"
   - Click on the failed deployment
   - View build and runtime logs

2. **Clear Build Cache**:
   - Service Settings → "Restart"
   - Or redeploy from scratch

3. **Verify Latest Code**:
   ```bash
   git log --oneline -5
   # Should show:
   # - Railway deployment configuration
   # - terser dependency added
   # - package-lock.json updated
   ```

4. **Force Redeploy**:
   - Go to Railway dashboard
   - Click "Redeploy" on your service

---

## 🎯 Expected Behavior

### Successful Deployment

You should see in Railway logs:

```
[Build] Running: npm ci
[Build] added 555 packages in 12s
[Build] Running: npm run build:prod
[Build] vite v5.4.21 building for production...
[Build] ✓ 1251 modules transformed.
[Build] ✓ built in 6.86s
[Start] Running: npm start
[Start] Serving dist/ on http://0.0.0.0:$PORT
```

### Deployed URLs

After successful deployment, Railway will provide:
- **Frontend**: `https://your-app-name.railway.app`
- **Backend**: `https://your-backend.railway.app`

---

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to Service Settings
2. Click "Domains"
3. Click "Add Domain"
4. Enter your domain
5. Add DNS records as instructed by Railway

---

## 💡 Tips

1. **Deploy backend first**, then frontend (so frontend can connect)
2. **Use Railway environment groups** for shared environment variables
3. **Enable auto-deploy** for automatic deployments on Git push
4. **Monitor usage** - Railway has usage limits on free tier
5. **Use Railway CLI** for local testing: `railway run npm run dev`

---

## 📞 Support

If you encounter issues:

1. Check Railway status: https://status.railway.app
2. Review Railway docs: https://docs.railway.app
3. Check this project's GitHub issues
4. Railway Discord: https://discord.gg/railway

---

## 📦 What Gets Deployed

### Frontend (Web App)
- Built static files in `dist/` folder
- React application
- Tailwind CSS styles
- All assets and icons
- Served via `serve` package

### Backend (API)
- FastAPI application
- Python dependencies
- Database migrations (if configured)
- REST API endpoints

---

## ✅ Verification

After deployment, verify:

1. **Frontend loads**: Visit your Railway URL
2. **Login works**: Try demo credentials
3. **API calls work**: Check browser console for errors
4. **No CORS errors**: Frontend can reach backend

---

**Last Updated**: 2024-11-21
**Version**: 1.0.0
