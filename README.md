# Imtiaz Trading Platform

Complete multi-branch trading platform with Manager, Admin, and Client dashboards.

Available as **Web Application**, **Native Desktop App** (Windows, macOS, Linux), and **Native Mobile App** (iOS, Android).

## Features
- Multi-role authentication
- Risk management system
- KYC/AML compliance
- Liquidity provider integration
- Branch referral system
- **Native Desktop Application** with Tauri
- **Native Mobile Application** with Capacitor
- Platform-specific features (notifications, haptics, native dialogs, safe areas)

## Quick Start

### Web Application
```bash
npm install
npm run dev
```

### Desktop Application
```bash
npm install
npm run tauri:dev
```

### Mobile Application
```bash
npm install
npm run build
npm run mobile:sync
npm run mobile:ios      # Opens in Xcode
npm run mobile:android  # Opens in Android Studio
```

See [MOBILE_APP.md](./MOBILE_APP.md) for complete mobile app documentation.

## Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Full-stack setup guide
- **[DESKTOP_APP.md](./DESKTOP_APP.md)** - Desktop application guide
- **[MOBILE_APP.md](./MOBILE_APP.md)** - Mobile application guide (NEW!)
- **[backend/SETUP.md](./backend/SETUP.md)** - Backend setup instructions

## Demo Credentials
- Manager: manager@imtiaz.com / manager123
- Admin: admin@imtiaz.com / admin123
- Client: client@example.com / client123

## Platform Support

| Platform | Web App | Desktop App | Mobile App |
|----------|---------|-------------|------------|
| Windows  | ✅      | ✅          | ❌         |
| macOS    | ✅      | ✅          | ❌         |
| Linux    | ✅      | ✅          | ❌         |
| iOS      | ✅      | ❌          | ✅         |
| Android  | ✅      | ❌          | ✅         |

**Legend:**
- **Web App**: Runs in browser on any platform
- **Desktop App**: Native Windows/macOS/Linux application (Tauri)
- **Mobile App**: Native iOS/Android application (Capacitor)
