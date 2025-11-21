# Imtiaz Trading Platform - Build & Deployment Guide

This guide explains how to build and deploy the Imtiaz Trading Platform for multiple platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Building for Different Platforms](#building-for-different-platforms)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### For All Builds
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### For Desktop Builds (Windows, macOS, Linux)
- **Electron Builder** (installed via npm)
- For Windows: Windows 7+ (build on Windows for best results)
- For macOS: macOS 10.13+ with Xcode Command Line Tools
- For Linux: Any modern Linux distribution

### For Android Builds
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Java Development Kit (JDK) 17** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Android SDK** (installed via Android Studio)
- **Gradle** (included with Android Studio)

### For iOS Builds
- **macOS** (required)
- **Xcode 14+** - [Download from Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **CocoaPods** - Install: `sudo gem install cocoapods`
- **Apple Developer Account** (for distribution)

---

## 🌍 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/imtiaz-trading-platform.git
cd imtiaz-trading-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

#### Frontend Environment

Copy the appropriate environment file:

```bash
# For production
cp .env.production .env

# For staging
cp .env.staging .env
```

Edit `.env` and update:
- `VITE_API_BASE_URL` - Your backend API URL
- `VITE_WS_URL` - Your WebSocket URL (for real-time features)

#### Backend Environment

```bash
cd backend
cp .env.production.example .env
```

Edit `backend/.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `SECRET_KEY` - Generate a secure secret key
- `CORS_ORIGINS` - Your frontend URLs
- Other service credentials as needed

---

## 🏗️ Building for Different Platforms

### Web Application (Production)

Build optimized static files for web deployment:

```bash
npm run build:prod
```

Output: `./dist/` directory

Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3**: Upload `dist/` folder to S3 bucket
- **Any static hosting**: Upload `dist/` folder

---

### Desktop Applications

#### Windows

**Build on Windows for best results**

```bash
# Build Windows installer
npm run electron:build:win
```

Outputs in `./build-desktop/`:
- `Imtiaz Trading Platform Setup 1.0.0.exe` - NSIS installer
- `Imtiaz Trading Platform 1.0.0.exe` - Portable version

**Distribution:**
- Upload to your website
- Distribute via Microsoft Store
- Use code signing certificate for trusted installation

#### macOS

**Build on macOS**

```bash
# Build macOS app
npm run electron:build:mac
```

Outputs in `./build-desktop/`:
- `Imtiaz Trading Platform-1.0.0.dmg` - DMG installer
- `Imtiaz Trading Platform-1.0.0-mac.zip` - ZIP archive

**Distribution:**
- Upload to your website
- Distribute via Mac App Store (requires Apple Developer account)
- Notarize the app for macOS Gatekeeper

#### Linux

```bash
# Build Linux packages
npm run electron:build:linux
```

Outputs in `./build-desktop/`:
- `imtiaz-trading-platform-1.0.0.AppImage` - AppImage (universal)
- `imtiaz-trading-platform_1.0.0_amd64.deb` - Debian/Ubuntu package
- `imtiaz-trading-platform-1.0.0.x86_64.rpm` - Red Hat/Fedora package

**Distribution:**
- Upload to your website
- Distribute via Snap Store or Flathub

#### All Desktop Platforms

Build for all desktop platforms at once:

```bash
npm run electron:build:all
```

---

### Android Application

#### Prerequisites Setup

1. Install Android Studio
2. Install JDK 17
3. Set up environment variables:

```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Build Debug APK (for testing)

```bash
npm run android:sync
npm run android:open
# In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
```

#### Build Release APK

**Important:** The keystore (`imtiaz-trading.jks`) is already configured.

```bash
npm run android:build
```

Output: `./android/app/build/outputs/apk/release/app-release.apk`

#### Build Release Bundle (AAB) for Google Play

```bash
npm run android:bundle
```

Output: `./android/app/build/outputs/bundle/release/app-release.aab`

#### Publishing to Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Create a new app in Google Play Console
3. Upload the AAB file
4. Fill in store listing details
5. Set up pricing and distribution
6. Submit for review

**Key Configuration File:** `./android/key.properties`
```properties
storeFile=imtiaz-trading.jks
keyAlias=imtiaz-trading-key
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
```

---

### iOS Application

#### Prerequisites Setup

1. Install Xcode from Mac App Store
2. Install CocoaPods: `sudo gem install cocoapods`
3. Enroll in Apple Developer Program ($99/year)

#### Build Process

```bash
# Sync project
npm run ios:sync

# Open in Xcode
npm run ios:open
```

#### In Xcode:

1. Select target device/simulator
2. Configure signing:
   - Select project in navigator
   - Select target "App"
   - Go to "Signing & Capabilities"
   - Select your team
   - Xcode will automatically manage signing
3. Build:
   - For testing: `Product > Build` (Cmd+B)
   - For device: `Product > Archive`

#### Publishing to App Store

1. Archive the app: `Product > Archive`
2. In Organizer window, click "Distribute App"
3. Choose "App Store Connect"
4. Follow the wizard to upload
5. Go to App Store Connect
6. Fill in app information
7. Submit for review

---

## 🚀 Deployment

### Backend Deployment

#### Option 1: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`
5. Add environment variables in Railway dashboard

#### Option 2: Heroku

```bash
heroku login
heroku create imtiaz-trading-api
git push heroku main
heroku config:set KEY=VALUE  # Add environment variables
```

#### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

```bash
# SSH to server
ssh user@your-server-ip

# Install dependencies
sudo apt update
sudo apt install python3 python3-pip postgresql nginx

# Clone and setup
git clone your-repo
cd backend
pip3 install -r requirements.txt

# Setup systemd service (see DEPLOYMENT_GUIDE.md)
# Setup nginx reverse proxy
```

### Frontend Deployment

#### Vercel (Recommended for Web)

```bash
npm install -g vercel
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Custom Server (nginx)

```bash
# Build
npm run build:prod

# Copy dist/ to server
scp -r dist/* user@server:/var/www/imtiaz-trading/

# Configure nginx to serve from /var/www/imtiaz-trading/
```

---

## 🛠️ Quick Build Script

We provide an interactive build script:

```bash
./build.sh
```

This will show a menu to build for any platform.

---

## 📱 App Store Assets

### Required Assets

For app stores, prepare:

1. **App Icons:**
   - Android: Various sizes in `android/app/src/main/res/`
   - iOS: AppIcon in Xcode Assets catalog
   - Generate: Use tools like [AppIconGenerator](https://appicon.co/)

2. **Screenshots:**
   - Multiple device sizes
   - At least 2 screenshots per device type
   - Recommended: 6.5" iPhone, 12.9" iPad, Android Phone, Android Tablet

3. **Store Listing:**
   - App name (30 chars)
   - Short description (80 chars)
   - Full description (4000 chars)
   - Keywords
   - Privacy policy URL
   - Support URL

---

## 🐛 Troubleshooting

### Electron Build Issues

**Issue:** "electron-builder not found"
```bash
npm install --save-dev electron electron-builder
```

**Issue:** "Code signing required for macOS"
```bash
# Disable code signing for testing (not for distribution)
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run electron:build:mac
```

### Android Build Issues

**Issue:** "ANDROID_HOME not set"
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Issue:** "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
npm run android:build
```

**Issue:** "keystore not found"
- Ensure `android/imtiaz-trading.jks` exists
- Check `android/key.properties` has correct passwords

### iOS Build Issues

**Issue:** "CocoaPods not installed"
```bash
sudo gem install cocoapods
cd ios/App
pod install
```

**Issue:** "Provisioning profile issues"
- Check Xcode signing settings
- Ensure correct team is selected
- Certificates must be valid

### General Issues

**Issue:** "npm install fails"
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue:** "Build fails with memory error"
```bash
export NODE_OPTIONS=--max_old_space_size=4096
npm run build:prod
```

---

## 📞 Support

For issues or questions:
- Check existing documentation in `/docs`
- Review GitHub Issues
- Contact: support@imtiaztrading.com

---

## 📄 License

Copyright © 2024 Imtiaz Trading. All rights reserved.
