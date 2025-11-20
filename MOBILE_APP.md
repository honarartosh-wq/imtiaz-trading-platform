# Imtiaz Trading Platform - Mobile Application Guide

This guide explains how to build and run the Imtiaz Trading Platform as a native mobile application for iOS and Android using Capacitor.

## Overview

The platform now supports **Web**, **Desktop** (Tauri), and **Native Mobile** (Capacitor):

- **Web Version**: Runs in mobile/desktop browsers
- **Desktop Version**: Native Windows, macOS, and Linux apps (Tauri)
- **Mobile Version**: Native iOS and Android apps (Capacitor)

## Technology Stack

- **Capacitor v7**: Cross-platform mobile framework
- **React + Vite**: Frontend (unchanged)
- **Native iOS/Android**: Uses native WebView and APIs
- **Plugins**: Status Bar, Keyboard, Splash Screen, Haptics, and more

## Features

### Mobile-Specific Features

✅ **Safe Area Handling**: Automatic handling of notches, home indicators, and status bars
✅ **Keyboard Management**: Smart keyboard behavior with proper resizing
✅ **Native Haptics**: Tactile feedback for buttons and interactions
✅ **Status Bar Control**: Dark/light modes, colors, visibility
✅ **Splash Screen**: Custom launch screen
✅ **Native Gestures**: Swipe, pull-to-refresh, pinch-to-zoom prevention
✅ **Orientation Support**: Portrait and landscape modes
✅ **Back Button Handling**: Android hardware back button support
✅ **App State Management**: Detect when app is active/inactive
✅ **Native Notifications**: Push notifications (future feature)

### Overlay & Viewport Handling

The app properly handles all mobile overlay concerns:

1. **Status Bar**: Configured to not overlap content (`overlaysWebView: false`)
2. **Keyboard**: Native resize mode that adjusts viewport when keyboard appears
3. **Safe Areas**: CSS variables for notch/home indicator padding
4. **Viewport**: Properly configured with `viewport-fit=cover` for full-screen experience
5. **Pull-to-Refresh**: Disabled to prevent accidental refreshes
6. **Text Selection**: Optimized for native app feel

## Prerequisites

### All Platforms

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **Install Project Dependencies**
   ```bash
   npm install
   ```

### iOS Development

Required for building iOS apps:

1. **macOS**: iOS development only works on Mac
2. **Xcode** (latest version from App Store)
3. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
4. **CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```
5. **iOS Simulator** (included with Xcode)
6. **Apple Developer Account** (for device testing and App Store)

### Android Development

Required for building Android apps:

1. **Android Studio** (latest version)
   - Download from: https://developer.android.com/studio
   - Install with "Standard" setup (includes Android SDK, emulator)

2. **Java Development Kit (JDK)** 11 or higher
   ```bash
   java --version  # Should be v11+
   ```

3. **Android SDK**:
   - Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
   - Install latest SDK Platform and SDK Tools
   - Recommended: API 33 (Android 13) or higher

4. **Environment Variables** (add to `.bashrc` or `.zshrc`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=$HOME/Android/Sdk          # Linux
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/emulator
   ```

5. **Android Emulator** or physical device for testing

## Installation & Setup

### 1. Install Dependencies (Already Done)

```bash
npm install
```

This installs:
- `@capacitor/core` - Core Capacitor runtime
- `@capacitor/cli` - Capacitor CLI
- `@capacitor/ios` - iOS platform
- `@capacitor/android` - Android platform
- `@capacitor/status-bar` - Status bar control
- `@capacitor/keyboard` - Keyboard management
- `@capacitor/splash-screen` - Splash screens
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/app` - App lifecycle

### 2. Build the Web App

Before running on mobile, build the web app:

```bash
npm run build
```

This creates the `dist/` folder with your built React app.

### 3. Sync to Mobile Platforms

Sync the web app to iOS and Android:

```bash
npm run mobile:sync
```

This command:
- Builds the web app
- Copies files to native projects
- Updates native configurations

## Development

### iOS Development

#### Open iOS Project in Xcode

```bash
npm run mobile:ios
```

This opens the iOS project in Xcode. Then:
1. Select a simulator (iPhone 14, iPhone 15, etc.)
2. Click the Play button to run
3. App will launch in simulator

#### Run Directly on iOS Simulator

```bash
npm run mobile:run:ios
```

Automatically builds and runs on iOS simulator.

#### Development Workflow

1. Make changes to React code
2. Run `npm run mobile:sync` to update iOS project
3. Xcode will hot-reload the changes

### Android Development

#### Open Android Project in Android Studio

```bash
npm run mobile:android
```

This opens the Android project in Android Studio. Then:
1. Wait for Gradle sync to complete
2. Select an emulator or connected device
3. Click Run button
4. App will launch on device/emulator

#### Run Directly on Android

```bash
npm run mobile:run:android
```

Automatically builds and runs on Android emulator or connected device.

#### Development Workflow

1. Make changes to React code
2. Run `npm run mobile:sync` to update Android project
3. Android Studio will rebuild automatically

### Live Reload (Advanced)

For faster development, use Capacitor live reload:

1. Start Vite dev server:
   ```bash
   npm run dev
   ```

2. Update `capacitor.config.json` temporarily:
   ```json
   {
     "server": {
       "url": "http://192.168.1.100:5173",
       "cleartext": true
     }
   }
   ```
   Replace `192.168.1.100` with your computer's IP address.

3. Run on device:
   ```bash
   npm run mobile:run:ios
   # or
   npm run mobile:run:android
   ```

Now changes will reload instantly without rebuilding!

**Remember**: Remove `server.url` before production builds.

## Building for Production

### Build for iOS

#### Using Xcode

1. Open project:
   ```bash
   npm run mobile:ios
   ```

2. In Xcode:
   - Select "Any iOS Device" as target
   - Product → Archive
   - Follow prompts to upload to App Store Connect

#### Using Command Line

```bash
npm run mobile:build:ios
```

Creates an `.ipa` file for distribution.

### Build for Android

#### Using Android Studio

1. Open project:
   ```bash
   npm run mobile:android
   ```

2. In Android Studio:
   - Build → Generate Signed Bundle / APK
   - Follow wizard to create signed APK or AAB
   - Upload to Google Play Console

#### Using Command Line

```bash
npm run mobile:build:android
```

Creates APK/AAB files in `android/app/build/outputs/`.

### Code Signing

#### iOS Code Signing

1. **Apple Developer Account**: $99/year
2. **Certificates**: Create in Apple Developer Portal
3. **Provisioning Profiles**: For development and distribution
4. **Configure in Xcode**:
   - Select project → Signing & Capabilities
   - Choose your team
   - Xcode handles the rest automatically

#### Android Code Signing

1. **Generate Keystore**:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore \
     -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure in Android Studio** or `build.gradle`

3. **Keep keystore safe**: You need it for all future updates!

## Configuration

### Capacitor Configuration

Main config: `capacitor.config.json`

```json
{
  "appId": "com.imtiaz.trading",
  "appName": "Imtiaz Trading Platform",
  "webDir": "dist",
  "plugins": {
    "StatusBar": {
      "style": "dark",
      "backgroundColor": "#0f172a",
      "overlaysWebView": false  // ← Prevents status bar overlay!
    },
    "Keyboard": {
      "resize": "native",  // ← Smart keyboard handling!
      "style": "dark"
    }
  }
}
```

### iOS Configuration

#### Info.plist (`ios/App/App/Info.plist`)

Key settings:
- **Display Name**: App name shown on home screen
- **Bundle Identifier**: Must match `appId` in config
- **Permissions**: Camera, location, notifications, etc.
- **Orientation**: Portrait, landscape, or both

#### Podfile (`ios/App/Podfile`)

Manages iOS dependencies (like npm for iOS).

### Android Configuration

#### AndroidManifest.xml (`android/app/src/main/AndroidManifest.xml`)

Key settings:
- **Package Name**: Must match `appId` in config
- **Permissions**: Internet, camera, storage, etc.
- **Screen Orientation**: Portrait, landscape, or both

#### build.gradle (`android/app/build.gradle`)

- **Version Code**: Integer version number
- **Version Name**: String version (e.g., "1.0.0")
- **Min SDK**: Minimum Android version (API 22 = Android 5.1)
- **Target SDK**: Target Android version (API 33 = Android 13)

## App Icons & Splash Screens

### Generating Icons

1. **Create source image**:
   - 1024x1024 PNG with transparency
   - Square design with padding

2. **Use online tool** or ImageMagick to generate all sizes

3. **iOS Icons**: Place in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

4. **Android Icons**: Place in:
   - `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

### Splash Screens

**iOS**: Configure in `ios/App/App/Assets.xcassets/Splash.imageset/`

**Android**: Configure in `android/app/src/main/res/drawable*/splash.png`

## API Configuration

The mobile app connects to your FastAPI backend:

### Development

Update `.env` or hard-code:
```javascript
// src/services/api.js
const API_BASE_URL = 'http://your-dev-server:8000';
```

**Note**: iOS/Android can't access `localhost`. Use your computer's IP or deploy backend to a server.

### Production

```javascript
const API_BASE_URL = 'https://api.your domain.com';
```

## Testing

### iOS Testing

**Simulator** (Free):
- Included with Xcode
- Fast and easy
- Can't test: Camera, haptics, push notifications

**Physical Device** (Requires Apple Developer Account):
1. Connect iPhone/iPad via USB
2. Select device in Xcode
3. Trust computer on device
4. Run app

### Android Testing

**Emulator** (Free):
- Create in Android Studio (AVD Manager)
- Good for most testing
- Slower than iOS simulator

**Physical Device** (Free):
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect via USB
4. Run app from Android Studio

## Troubleshooting

### Common iOS Issues

**"Command PhaseScriptExecution failed"**
- Solution: `cd ios/App && pod install && cd ../..`

**"Could not find iPhone X simulator"**
- Solution: Open Xcode → Window → Devices and Simulators → Download simulator

**"Code signing error"**
- Solution: Select your team in Xcode project settings

### Common Android Issues

**"SDK location not found"**
- Solution: Create `android/local.properties`:
  ```
  sdk.dir=/Users/yourname/Library/Android/sdk  # macOS
  sdk.dir=/home/yourname/Android/Sdk           # Linux
  ```

**"Gradle sync failed"**
- Solution: File → Invalidate Caches / Restart in Android Studio

**"INSTALL_FAILED_UPDATE_INCOMPATIBLE"**
- Solution: Uninstall old app from device first

### Keyboard Issues

**Keyboard covers input fields**:
- Check `Keyboard.resize` is set to `"native"` in config
- Ensure viewport meta tag includes `viewport-fit=cover`

**Keyboard doesn't appear**:
- Test on real device (simulators can be buggy)
- Check that input fields are properly focused

### Status Bar Issues

**Status bar overlaps content**:
- Ensure `StatusBar.overlaysWebView` is `false` in config
- Check safe area padding in `index.html`

**Status bar wrong color**:
- Update `StatusBar.backgroundColor` in config
- Rebuild and sync: `npm run mobile:sync`

## Distribution

### iOS App Store

1. **Prepare**:
   - Apple Developer Account ($99/year)
   - App Store Connect account
   - Screenshots, description, keywords

2. **Archive & Upload**:
   - Xcode → Product → Archive
   - Distribute App → App Store Connect
   - Submit for review

3. **Review Process**:
   - Takes 1-3 days typically
   - May reject for guideline violations
   - Fix issues and resubmit

### Google Play Store

1. **Prepare**:
   - Google Play Developer Account ($25 one-time)
   - Play Console account
   - Screenshots, description, privacy policy

2. **Build Release**:
   - Generate signed AAB (Android App Bundle)
   - Upload to Play Console
   - Fill in store listing

3. **Review Process**:
   - Usually faster than iOS (hours to 1 day)
   - May request changes
   - Rolling release or full release

## Scripts Reference

```bash
# Web Development
npm run dev                    # Start web dev server
npm run build                  # Build web app

# Mobile - General
npm run mobile:sync            # Build & sync to iOS/Android

# Mobile - iOS
npm run mobile:ios             # Open in Xcode
npm run mobile:run:ios         # Run on iOS simulator
npm run mobile:build:ios       # Build for production

# Mobile - Android
npm run mobile:android         # Open in Android Studio
npm run mobile:run:android     # Run on Android device/emulator
npm run mobile:build:android   # Build for production

# Desktop (still available!)
npm run tauri:dev              # Run desktop app
npm run tauri:build            # Build desktop app
```

## Platform Comparison

| Feature | Web | Desktop (Tauri) | Mobile (Capacitor) |
|---------|-----|-----------------|-------------------|
| **Installer Size** | N/A | ~15 MB | ~15-30 MB |
| **Offline** | ❌ | ✅ | ✅ |
| **Native Notifications** | Limited | ✅ | ✅ |
| **File System** | Limited | ✅ | Limited |
| **Camera** | Limited | ❌ | ✅ |
| **Haptics** | ❌ | ❌ | ✅ |
| **GPS** | Limited | ❌ | ✅ |
| **Auto-Updates** | N/A | ✅ | Via Store |
| **Distribution** | Web Hosting | Direct Download | App Stores |

## Mobile-Specific Code Examples

### Using Haptic Feedback

```javascript
import { haptics } from '../utils/capacitor';

// Button press feedback
const handleButtonClick = async () => {
  await haptics.impact('light');
  // Your button logic
};

// Success notification
const handleSuccess = async () => {
  await haptics.notification('success');
};
```

### Using Status Bar

```javascript
import { statusBar } from '../utils/capacitor';

// Change status bar color
await statusBar.setBackgroundColor('#10b981');

// Change status bar style
await statusBar.setStyle('light');

// Hide status bar
await statusBar.hide();
```

### Using Keyboard

```javascript
import { keyboard } from '../utils/capacitor';

// Hide keyboard
await keyboard.hide();

// Listen for keyboard events
const removeListener = await keyboard.addListener('keyboardWillShow', (info) => {
  console.log('Keyboard height:', info.keyboardHeight);
});
```

### Using React Hooks

```javascript
import { useMobileInfo, useKeyboard, useSafeArea } from '../hooks/useCapacitor';

function MyComponent() {
  const { isMobile, isIOS, isAndroid, platform } = useMobileInfo();
  const { isVisible, height } = useKeyboard();
  const { top, bottom, hasNotch } = useSafeArea();

  return (
    <div style={{ paddingBottom: isVisible ? height : 0 }}>
      {isMobile && <p>Running on {platform}</p>}
      {hasNotch && <p>Device has notch</p>}
    </div>
  );
}
```

## Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Lazy Load**: Load components/images on demand
3. **Minimize Bundle Size**: Use code splitting
4. **Cache API Responses**: Reduce network requests
5. **Native Transitions**: Use CSS transitions for smooth animations
6. **Avoid Re-renders**: Use React.memo, useMemo, useCallback

## Security Considerations

1. **HTTPS Only**: Always use HTTPS for production API
2. **API Keys**: Never hardcode in frontend
3. **Token Storage**: Use secure storage for auth tokens
4. **SSL Pinning**: Prevent man-in-the-middle attacks (advanced)
5. **Code Obfuscation**: Use ProGuard (Android) and app thinning (iOS)

## Next Steps

### Recommended Enhancements

1. **Push Notifications**:
   ```bash
   npm install @capacitor/push-notifications
   ```

2. **Biometric Authentication**:
   ```bash
   npm install @capacitor-community/biometric-auth
   ```

3. **Camera/Photo Library**:
   ```bash
   npm install @capacitor/camera
   ```

4. **Geolocation**:
   ```bash
   npm install @capacitor/geolocation
   ```

5. **Local Notifications**:
   ```bash
   npm install @capacitor/local-notifications
   ```

6. **Secure Storage**:
   ```bash
   npm install @capacitor-community/sqlite
   ```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [Apple Developer Portal](https://developer.apple.com/)
- [Google Play Console](https://play.google.com/console)

## FAQ

**Q: Can I still run the web version?**
A: Yes! Use `npm run dev`. Mobile doesn't affect web.

**Q: Do I need a Mac for iOS development?**
A: Yes, iOS development requires macOS and Xcode.

**Q: Can I test iOS apps on Windows?**
A: No, but you can use cloud services like MacStadium or BrowserStack.

**Q: How much do app stores cost?**
A: Apple: $99/year, Google Play: $25 one-time.

**Q: Can I use same backend for web, desktop, and mobile?**
A: Yes! All three use the same FastAPI backend.

**Q: What about React Native?**
A: Capacitor is better for this project because it uses your existing web code. React Native requires a complete rewrite.

**Q: How do I handle different screen sizes?**
A: Use responsive design (Tailwind CSS already handles this well).

**Q: Can I access native features?**
A: Yes! Capacitor provides plugins for camera, GPS, storage, etc.

---

## Quick Start Checklist

**iOS**:
- [ ] Have macOS
- [ ] Install Xcode
- [ ] Install CocoaPods
- [ ] Run `npm run mobile:sync`
- [ ] Run `npm run mobile:ios`
- [ ] Build and run in Xcode

**Android**:
- [ ] Install Android Studio
- [ ] Install Android SDK (API 33+)
- [ ] Set up emulator or device
- [ ] Run `npm run mobile:sync`
- [ ] Run `npm run mobile:android`
- [ ] Build and run in Android Studio

**Congratulations!** Your trading platform now runs on iOS and Android! 📱✨
