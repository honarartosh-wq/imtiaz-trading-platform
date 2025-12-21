# Production Release Checklist

Use this checklist before releasing the Imtiaz Trading Platform to production.

## 📋 Pre-Release Checklist

### 1. Environment Configuration

- [ ] Update `.env.production` with production API URL
- [ ] Update `backend/.env` with production settings
- [ ] Set secure `SECRET_KEY` in backend .env (min 32 characters)
  - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- [ ] Set strong `ADMIN_PASSWORD` (min 12 characters with mixed case, numbers, special chars)
  - Generate with: `python -c "import secrets; import string; chars = string.ascii_letters + string.digits + string.punctuation; print(''.join(secrets.choice(chars) for _ in range(16)))"`
- [ ] Set production `ADMIN_EMAIL`
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Configure database pool settings:
  - [ ] Set `DB_POOL_SIZE` (default: 20, adjust based on load)
  - [ ] Set `DB_MAX_OVERFLOW` (default: 10)
  - [ ] Set `DB_POOL_TIMEOUT` (default: 30)
  - [ ] Set `DB_POOL_RECYCLE` (default: 3600)
- [ ] Set up proper CORS origins (production frontend URLs only)
- [ ] Configure email/SMTP settings (if applicable)
- [ ] Set up error tracking (Sentry, etc.) - optional
- [ ] Verify all required environment variables are set
- [ ] Enable `DEBUG=false` in production
- [ ] Configure `REDIS_URL` for production caching

### 2. Security

- [ ] All API endpoints require proper authentication
- [ ] HTTPS is enforced on production server
- [ ] Sensitive data is not logged
- [ ] Environment variables are not committed to Git
- [ ] `.env` files are in `.gitignore`
- [ ] API rate limiting is configured
- [ ] SQL injection prevention is tested
- [ ] XSS protection is verified
- [ ] CSRF tokens are implemented where needed
- [ ] No hardcoded credentials in frontend code
- [ ] No hardcoded credentials in backend code
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Content Security Policy (CSP) headers configured
- [ ] Secure cookie flags set (Secure, HttpOnly, SameSite)
- [ ] Password hashing uses bcrypt with proper salt rounds
- [ ] JWT tokens have appropriate expiration times
- [ ] Refresh tokens are properly rotated
- [ ] Input validation on all API endpoints
- [ ] File upload validation and size limits
- [ ] Database connection strings use SSL
- [ ] Secrets are stored in secure vault (not .env in production)

### 3. Code Quality

- [ ] Remove all console.log statements (or use proper logging)
- [ ] Remove debug/test code
- [ ] All TODO comments are addressed
- [ ] Code is properly commented
- [ ] No hardcoded credentials or API keys
- [ ] Error handling is comprehensive

### 4. Testing

- [ ] All features tested manually
- [ ] Login/authentication tested
- [ ] Account creation tested
- [ ] Trading features tested
- [ ] Admin dashboard tested
- [ ] Manager dashboard tested
- [ ] Client dashboard tested
- [ ] Test on different screen sizes
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

### 5. Build Configuration

- [ ] `package.json` version number updated
- [ ] App version in Capacitor config updated
- [ ] Android `versionCode` and `versionName` updated (android/app/build.gradle)
- [ ] iOS version and build numbers updated (if applicable)
- [ ] Build icons generated (512x512, .ico, .icns)
- [ ] Splash screen configured
- [ ] App name and description verified

### 6. Backend Deployment

- [ ] Backend deployed to production server
- [ ] Database migrations run successfully
- [ ] Database is backed up regularly
- [ ] SSL certificate installed and verified
- [ ] Health check endpoint working (`/health`)
- [ ] API documentation is up to date

### 7. Android Release

- [ ] Signing keystore is secure and backed up
- [ ] `key.properties` has correct credentials
- [ ] App permissions are minimized and justified
- [ ] Privacy policy URL is set
- [ ] Google Play Console account created
- [ ] Store listing prepared:
  - [ ] App title (30 chars)
  - [ ] Short description (80 chars)
  - [ ] Full description (4000 chars)
  - [ ] Screenshots (at least 2)
  - [ ] Feature graphic (1024x500)
  - [ ] App icon (512x512)
  - [ ] Content rating completed
  - [ ] Pricing set
- [ ] Build signed APK/AAB: `npm run android:bundle`
- [ ] Test the release build on real device

### 8. iOS Release

- [ ] Apple Developer account active ($99/year)
- [ ] Certificates and provisioning profiles configured
- [ ] App ID registered in Apple Developer Portal
- [ ] Privacy policy URL set
- [ ] App Store Connect listing prepared:
  - [ ] App name
  - [ ] Subtitle
  - [ ] Description
  - [ ] Keywords
  - [ ] Screenshots (all required sizes)
  - [ ] App preview video (optional)
  - [ ] App icon
  - [ ] Support URL
  - [ ] Marketing URL (optional)
  - [ ] Copyright
  - [ ] Age rating
- [ ] Archive and upload to App Store Connect
- [ ] TestFlight beta tested (recommended)

### 9. Desktop Release (Windows/Mac/Linux)

- [ ] Build icons generated (see build-resources/README.md)
- [ ] Windows installer built: `npm run electron:build:win`
- [ ] macOS app built and notarized (if distributing outside App Store)
- [ ] Linux packages built: `npm run electron:build:linux`
- [ ] Test installers on clean systems
- [ ] Code signing set up (recommended for Windows and macOS)
- [ ] Auto-update configured (optional)

### 10. Web Deployment

- [ ] Build production bundle: `npm run build:prod`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy to hosting service (Vercel, Netlify, etc.)
- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] CDN configured (optional but recommended)
- [ ] Verify all assets load correctly
- [ ] Test PWA functionality (if applicable)

### 11. Marketing & Legal

- [ ] Privacy Policy created and accessible
- [ ] Terms of Service created and accessible
- [ ] Cookie policy (if applicable)
- [ ] GDPR compliance (if targeting EU)
- [ ] App store marketing materials prepared
- [ ] Social media accounts set up
- [ ] Support email/system set up
- [ ] Documentation for users available

### 12. Monitoring & Analytics

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Uptime monitoring set up
- [ ] Server performance monitoring
- [ ] Backup strategy verified
- [ ] Disaster recovery plan in place

### 13. Post-Launch

- [ ] Monitor error logs for first 24-48 hours
- [ ] Check server resource usage
- [ ] Respond to user feedback
- [ ] Monitor app store reviews
- [ ] Prepare update/patch if critical issues found
- [ ] Document known issues and workarounds

---

## 🚀 Quick Build Commands

### Web (Production)
```bash
npm run build:prod
```

### Desktop - Windows
```bash
npm run electron:build:win
```

### Desktop - macOS
```bash
npm run electron:build:mac
```

### Desktop - Linux
```bash
npm run electron:build:linux
```

### Desktop - All Platforms
```bash
npm run electron:build:all
```

### Android APK
```bash
npm run android:build
```

### Android Bundle (for Play Store)
```bash
npm run android:bundle
```

### iOS
```bash
npm run ios:sync
npm run ios:open
# Then build in Xcode
```

### All Platforms
```bash
./build.sh
# Select option 9
```

---

## 📞 Emergency Contacts

- **Backend Issues**: [Backend Developer]
- **Frontend Issues**: [Frontend Developer]
- **Server/DevOps**: [DevOps Engineer]
- **App Stores**: [Release Manager]

---

## 🔄 Version History

- **v1.0.0** - Initial release
  - Multi-branch trading platform
  - Admin, Manager, and Client dashboards
  - Real-time trading features
  - Mobile and desktop support

---

## ✅ Final Check

Before submitting to app stores or deploying:

1. [ ] All items in this checklist are completed
2. [ ] App is tested on real devices
3. [ ] Production backend is live and tested
4. [ ] All credentials and secrets are secured
5. [ ] Team has reviewed the release
6. [ ] Rollback plan is documented
7. [ ] Support team is briefed

---

**Remember:** Take your time with each step. It's better to delay a release than to release with critical bugs or security issues.

Good luck with your release! 🚀
