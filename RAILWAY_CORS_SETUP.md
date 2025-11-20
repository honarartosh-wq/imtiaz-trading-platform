# Railway CORS Configuration

## ⚠️ IMPORTANT: Update CORS Settings on Railway

Your mobile apps need permission to connect to your backend. Add this environment variable in Railway:

### In Railway Dashboard:

1. Go to your service: https://railway.com/project/9f5495cc-dda4-498d-9b0a-b866b6d39e1f/service/8faa8ac5-481e-4829-b0ee-3c504ba75491
2. Click on **"Variables"** tab
3. Click **"+ New Variable"**
4. Add or update `CORS_ORIGINS`:

```
CORS_ORIGINS=capacitor://localhost,http://localhost,ionic://localhost,https://localhost,http://localhost:5173,http://localhost:3000
```

5. Click **"Deploy"** to restart with new settings

### Why This is Needed:
- `capacitor://localhost` - Required for iOS and Android apps
- `ionic://localhost` - Alternative iOS protocol
- `https://localhost` - Secure local connections
- `http://localhost:5173` - Your web app development
- `http://localhost:3000` - Alternative web port

After updating, your mobile apps will be able to authenticate and make API calls! ✅
