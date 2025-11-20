# Imtiaz Trading Platform - Desktop Application Guide

This guide explains how to build and run the Imtiaz Trading Platform as a native desktop application using Tauri.

## Overview

The platform now supports both **web** and **native desktop** deployment:

- **Web Version**: Runs in browser (existing functionality)
- **Desktop Version**: Native Windows, macOS, and Linux applications with system integration

## Technology Stack

- **Tauri v2.9**: Lightweight desktop framework (~10-15 MB vs Electron's ~100+ MB)
- **React + Vite**: Frontend (unchanged)
- **Rust**: Backend for desktop features
- **Native WebView**: Uses system's built-in browser engine

## Features

### Desktop-Specific Features

- **Native Window Controls**: Minimize, maximize, close buttons
- **System Integration**: Native notifications, system tray support
- **File System Access**: Save/load files with native dialogs
- **Better Performance**: Lower memory usage, faster startup
- **Offline Capable**: Can work without internet (backend must be local)
- **Auto-Updates**: Built-in update mechanism (configurable)

### Desktop Utilities Available

The app includes comprehensive desktop utilities in `src/utils/tauri.js`:

- **Window Management**: Minimize, maximize, fullscreen, resize, center
- **Notifications**: Native system notifications
- **Dialogs**: Native message and confirmation dialogs
- **Clipboard**: Read/write clipboard content
- **File System**: Open and save file dialogs
- **Platform Detection**: Check OS and app version

### React Hooks

Custom hooks in `src/hooks/useTauri.js`:

- `useIsTauri()` - Check if running as desktop app
- `useIsWeb()` - Check if running in browser
- `usePlatform()` - Get OS platform (windows, linux, macos)
- `useAppVersion()` - Get desktop app version
- `useWindowSize()` - Track window dimensions
- `useWindowState()` - Track maximized/fullscreen state
- `useSystemTheme()` - Detect system dark/light mode
- `useDesktopInfo()` - Combined desktop environment info

## Prerequisites

### All Platforms

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16+
   ```

2. **Rust** (latest stable)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustc --version  # Verify installation
   ```

### Platform-Specific Dependencies

#### Windows

Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/):
- Select "Desktop development with C++"
- Install Windows 10 SDK

Or install via chocolatey:
```powershell
choco install visualstudio2022-workload-vctools
```

#### macOS

Install Xcode Command Line Tools:
```bash
xcode-select --install
```

#### Linux (Debian/Ubuntu)

Install required system libraries:
```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  libjavascriptcoregtk-4.1-dev \
  libsoup-3.0-dev
```

#### Linux (Fedora)

```bash
sudo dnf install \
  webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Linux (Arch)

```bash
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd imtiaz-trading-platform
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Install Rust dependencies** (automatic on first build):
   ```bash
   cd src-tauri
   cargo fetch
   cd ..
   ```

## Development

### Running the Desktop App in Development Mode

Start the desktop app with hot-reload:

```bash
npm run tauri:dev
```

This will:
1. Start the Vite dev server (http://localhost:5173)
2. Launch the Tauri desktop window
3. Enable hot-reload for both frontend and Rust code

### Running the Web App (existing)

To run as a web app in browser:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Development Tips

- **Hot Reload**: Frontend changes reload automatically
- **Rust Changes**: Rust code recompiles on save (takes a few seconds)
- **Console Logs**:
  - Frontend logs appear in the terminal
  - Use Chrome DevTools: Right-click → Inspect Element
- **Debug Mode**: Set `TAURI_DEBUG=1` for verbose logging

## Building for Production

### Build for Current Platform

Build a production-ready installer for your current OS:

```bash
npm run tauri:build
```

This creates:
- **Windows**: `.exe` installer and `.msi` in `src-tauri/target/release/bundle/`
- **macOS**: `.dmg` and `.app` in `src-tauri/target/release/bundle/`
- **Linux**: `.deb`, `.appimage`, and/or `.rpm` in `src-tauri/target/release/bundle/`

Build output location:
```
src-tauri/target/release/bundle/
├── dmg/          (macOS)
├── deb/          (Linux Debian/Ubuntu)
├── appimage/     (Linux Universal)
├── msi/          (Windows)
└── nsis/         (Windows)
```

### Build Options

**Debug build** (faster, larger, includes debug symbols):
```bash
npm run tauri:build -- --debug
```

**Specific bundle format**:
```bash
# Windows MSI only
npm run tauri:build -- --bundles msi

# Linux AppImage only
npm run tauri:build -- --bundles appimage

# macOS DMG only
npm run tauri:build -- --bundles dmg
```

### Cross-Platform Builds

To build for other platforms, you typically need to build on that platform. However:

- **Windows → Linux**: Possible with Docker
- **macOS only**: Can build for both Intel and Apple Silicon
- **Linux**: Can build for multiple distributions

## Configuration

### Tauri Configuration

Main config file: `src-tauri/tauri.conf.json`

Key settings:

```json
{
  "productName": "Imtiaz Trading Platform",
  "version": "1.0.0",
  "identifier": "com.imtiaz.trading",
  "app": {
    "windows": [{
      "title": "Imtiaz Trading Platform",
      "width": 1400,
      "height": 900,
      "minWidth": 1024,
      "minHeight": 768
    }]
  }
}
```

### Customizing Window Behavior

Edit `src-tauri/tauri.conf.json` to customize:

```json
{
  "app": {
    "windows": [{
      "title": "Your Title",
      "width": 1400,
      "height": 900,
      "minWidth": 1024,
      "minHeight": 768,
      "resizable": true,
      "fullscreen": false,
      "center": true,
      "alwaysOnTop": false,
      "decorations": true,  // Window frame
      "transparent": false   // Transparent background
    }]
  }
}
```

### App Icons

Icons are located in `src-tauri/icons/`:

- `icon.icns` - macOS
- `icon.ico` - Windows
- `*.png` - Linux and other platforms

To generate new icons from a single source:

```bash
npm run tauri:icon path/to/your-icon.png
```

Requirements:
- Source image: 1024x1024px PNG with transparency
- Square aspect ratio

## Backend Configuration

### Connecting to Backend API

The desktop app connects to your FastAPI backend just like the web version.

**Development** (default):
- Frontend uses backend at `http://localhost:8000`
- Set in `.env`:
  ```
  VITE_API_BASE_URL=http://localhost:8000
  ```

**Production**:
- Update `VITE_API_BASE_URL` to your production API
- Or bundle the backend with the desktop app (advanced)

### Running Backend

Start the FastAPI backend (required for desktop app):

```bash
cd backend
pip install -r requirements.txt

# Set up database and environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

See `backend/SETUP.md` for detailed backend setup instructions.

## Application Architecture

### Folder Structure

```
imtiaz-trading-platform/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/
│   │   └── useTauri.js     # Desktop hooks
│   ├── utils/
│   │   └── tauri.js        # Desktop utilities
│   └── App.jsx             # Main app (shows desktop badge)
├── src-tauri/              # Tauri desktop app
│   ├── src/                # Rust source
│   │   └── main.rs         # Main Rust entry point
│   ├── icons/              # App icons
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── backend/                # FastAPI backend (unchanged)
└── package.json            # Node scripts with tauri commands
```

### How It Works

1. **Development**:
   - Vite dev server runs React app
   - Tauri creates native window displaying the web app
   - Backend runs separately (FastAPI)

2. **Production**:
   - React app is built to static files (`dist/`)
   - Tauri bundles static files into native app
   - App loads HTML from local filesystem (fast!)
   - API calls go to configured backend URL

### Platform Detection

The app automatically detects if it's running as desktop or web:

```javascript
import { useIsTauri } from './hooks/useTauri';

function MyComponent() {
  const isTauri = useIsTauri();

  return (
    <div>
      {isTauri ? 'Running as Desktop App' : 'Running in Browser'}
    </div>
  );
}
```

## Distributing Your App

### Windows

- `.exe` - NSIS installer (recommended)
- `.msi` - MSI installer (for enterprise)
- **Code Signing**: Consider signing for production

### macOS

- `.dmg` - Disk image (recommended for distribution)
- `.app` - Application bundle
- **Notarization**: Required for distribution (Apple Developer account needed)

### Linux

- `.deb` - Debian/Ubuntu
- `.appimage` - Universal Linux binary (works on most distros)
- `.rpm` - Fedora/RHEL/CentOS

### Code Signing & Notarization

For production apps, you should:

1. **Windows**: Sign with a code signing certificate
2. **macOS**: Sign and notarize with Apple Developer account
3. **Linux**: Optional signing

See [Tauri documentation](https://tauri.app/v1/guides/distribution/) for details.

## Troubleshooting

### Common Issues

#### "Failed to run custom build command" (Linux)

**Problem**: Missing system dependencies

**Solution**: Install required libraries (see Linux dependencies above)

#### "WebView2 not found" (Windows)

**Problem**: WebView2 runtime not installed

**Solution**: Install [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

#### "Cannot find module @tauri-apps/api"

**Problem**: Node dependencies not installed

**Solution**:
```bash
npm install
```

#### Build fails with Rust errors

**Problem**: Rust not installed or outdated

**Solution**:
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update Rust
rustup update
```

#### Port 5173 already in use

**Problem**: Vite dev server port is taken

**Solution**: Change port in `vite.config.js` and `src-tauri/tauri.conf.json`

### Getting Help

- [Tauri Documentation](https://tauri.app/)
- [Tauri Discord](https://discord.gg/tauri)
- [GitHub Issues](https://github.com/tauri-apps/tauri/issues)

## Performance

### App Size

Typical installer sizes:
- **Windows**: ~15-20 MB
- **macOS**: ~12-18 MB
- **Linux**: ~20-25 MB (includes dependencies)

Compare to Electron: ~100-150 MB

### Memory Usage

- **Tauri**: ~50-150 MB RAM
- **Electron**: ~200-500 MB RAM

### Startup Time

- **Development**: 2-5 seconds (includes compilation)
- **Production**: < 1 second

## Next Steps

### Recommended Enhancements

1. **Auto-Updates**: Enable automatic app updates
   ```bash
   npm install @tauri-apps/plugin-updater
   ```

2. **System Tray**: Add system tray icon for background operation
   - Icon remains in taskbar when window closed
   - Quick access to key features

3. **Native Notifications**: Use for trade alerts
   - Already available via `notification` utility

4. **Local Storage**: Store settings locally
   - Better performance than web localStorage
   - Persists between sessions

5. **Keyboard Shortcuts**: Global shortcuts
   - Work even when app is not focused

6. **Multiple Windows**: Support multiple trading windows
   - Monitor different accounts simultaneously

## Scripts Reference

```bash
# Web Development
npm run dev                 # Start web dev server
npm run build               # Build web app
npm run preview             # Preview web build

# Desktop Development
npm run tauri              # Tauri CLI commands
npm run tauri:dev          # Start desktop app (dev mode)
npm run tauri:build        # Build desktop app (production)
npm run tauri:icon         # Generate app icons

# Backend (separate terminal)
cd backend
python -m uvicorn app.main:app --reload
```

## Security Considerations

1. **API Keys**: Never hardcode in frontend
   - Use environment variables
   - Configure in backend

2. **Content Security Policy**: Already configured in `tauri.conf.json`
   - Restricts what the app can load
   - Prevents XSS attacks

3. **HTTPS**: Use HTTPS for production API
   - Required for secure data transmission

4. **Updates**: Keep Tauri and dependencies updated
   ```bash
   npm update
   cargo update
   ```

## FAQ

**Q: Can I still run the web version?**
A: Yes! Use `npm run dev` for web, `npm run tauri:dev` for desktop.

**Q: Do I need to maintain two codebases?**
A: No! The same React code works for both web and desktop.

**Q: What about mobile apps?**
A: Tauri doesn't support mobile. Consider React Native or Capacitor for iOS/Android.

**Q: Can I bundle the backend with the desktop app?**
A: Yes, advanced setup. Package Python backend as executable and bundle it.

**Q: How do users get updates?**
A: Implement auto-updates with `@tauri-apps/plugin-updater` or manual download.

**Q: Is the desktop app secure?**
A: Yes, Tauri uses system WebView and has built-in security features. Keep dependencies updated.

---

## Quick Start Checklist

- [ ] Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- [ ] Install platform dependencies (see above)
- [ ] Install Node packages: `npm install`
- [ ] Start backend: `cd backend && uvicorn app.main:app --reload`
- [ ] Run desktop app: `npm run tauri:dev`
- [ ] Build for production: `npm run tauri:build`

**Congratulations!** Your trading platform now runs as a native desktop application! 🚀
