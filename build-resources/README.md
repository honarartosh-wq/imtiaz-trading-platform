# Build Resources

This directory contains resources needed for building desktop and mobile applications.

## Required Files

### Desktop (Electron)

You need to add the following icon files to this directory:

1. **icon.png** - 512x512 PNG (for Windows and Linux)
2. **icon.ico** - Windows icon file (multi-size)
3. **icon.icns** - macOS icon file

### How to Generate Icons

#### Option 1: Use Online Tools
- [AppIconGenerator](https://appicon.co/) - Generate all formats
- [IconGenerator](https://icon.kitchen/) - Free icon generator

#### Option 2: Use electron-icon-builder

```bash
npm install -g electron-icon-builder

# Create a 1024x1024 PNG source image first (icon-source.png)
electron-icon-builder --input=./icon-source.png --output=./build-resources --flatten
```

#### Option 3: Manual Creation

**For .ico (Windows):**
- Use GIMP, Photoshop, or online converters
- Include sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256

**For .icns (macOS):**
```bash
mkdir icon.iconset
# Create various sizes and place in icon.iconset/
# icon_16x16.png, icon_32x32.png, etc.
iconutil -c icns icon.iconset
```

## Current Icon

Currently, we're using the SVG logo from `/public/logo.svg`. You should:

1. Export it as a high-resolution PNG (1024x1024)
2. Generate the required formats
3. Place them in this directory

## entitlements.mac.plist

This file is already included and contains macOS app entitlements for:
- JIT compilation
- Unsigned executable memory
- Debugging capabilities

## Directory Structure

```
build-resources/
├── README.md              # This file
├── entitlements.mac.plist # macOS entitlements
├── icon.png              # (Add this) 512x512 PNG
├── icon.ico              # (Add this) Windows icon
├── icon.icns             # (Add this) macOS icon
└── icons/                # (Add this) For Linux various sizes
    ├── 16x16.png
    ├── 32x32.png
    ├── 48x48.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    └── 512x512.png
```

## Note

The electron-builder will use these icons when building:
- Windows: Uses `icon.ico` and `icon.png`
- macOS: Uses `icon.icns`
- Linux: Uses `icons/` directory with various sizes
