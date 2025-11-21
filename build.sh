#!/bin/bash

# Imtiaz Trading Platform - Build Script
# This script helps build the application for different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Imtiaz Trading Platform - Build Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Show menu
echo "Select build target:"
echo "1) Web (Production)"
echo "2) Desktop - Windows"
echo "3) Desktop - macOS"
echo "4) Desktop - Linux"
echo "5) Desktop - All Platforms"
echo "6) Android APK"
echo "7) Android Bundle (AAB)"
echo "8) iOS"
echo "9) All Platforms"
echo "0) Exit"
echo ""
read -p "Enter your choice [0-9]: " choice

case $choice in
    1)
        print_info "Building for Web (Production)..."
        npm run build:prod
        print_success "Web build completed! Output: ./dist"
        ;;
    2)
        print_info "Building for Windows..."
        npm run electron:build:win
        print_success "Windows build completed! Output: ./build-desktop"
        ;;
    3)
        print_info "Building for macOS..."
        npm run electron:build:mac
        print_success "macOS build completed! Output: ./build-desktop"
        ;;
    4)
        print_info "Building for Linux..."
        npm run electron:build:linux
        print_success "Linux build completed! Output: ./build-desktop"
        ;;
    5)
        print_info "Building for all desktop platforms..."
        npm run electron:build:all
        print_success "All desktop builds completed! Output: ./build-desktop"
        ;;
    6)
        print_info "Building Android APK..."
        print_info "Make sure you have Android Studio and JDK installed."
        npm run android:build
        print_success "Android APK build completed! Output: ./android/app/build/outputs/apk/release/"
        ;;
    7)
        print_info "Building Android Bundle (AAB)..."
        print_info "Make sure you have Android Studio and JDK installed."
        npm run android:bundle
        print_success "Android Bundle build completed! Output: ./android/app/build/outputs/bundle/release/"
        ;;
    8)
        print_info "Building for iOS..."
        print_info "Make sure you have Xcode installed (macOS only)."
        npm run ios:sync
        npm run ios:open
        print_info "Xcode will open. Build the app from Xcode."
        ;;
    9)
        print_info "Building for ALL platforms..."
        print_info "This may take a while..."

        # Web
        print_info "1/4 Building Web..."
        npm run build:prod
        print_success "Web build completed!"

        # Desktop
        print_info "2/4 Building Desktop (all platforms)..."
        npm run electron:build:all
        print_success "Desktop builds completed!"

        # Android
        print_info "3/4 Building Android..."
        npm run android:build
        print_success "Android build completed!"

        # iOS
        print_info "4/4 Syncing iOS..."
        npm run ios:sync
        print_success "iOS synced! Open Xcode to build."

        print_success "ALL builds completed!"
        echo ""
        echo "Build outputs:"
        echo "  - Web: ./dist"
        echo "  - Desktop: ./build-desktop"
        echo "  - Android: ./android/app/build/outputs/apk/release/"
        echo "  - iOS: Open with 'npm run ios:open' and build in Xcode"
        ;;
    0)
        print_info "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice!"
        exit 1
        ;;
esac

echo ""
print_success "Build process completed successfully!"
