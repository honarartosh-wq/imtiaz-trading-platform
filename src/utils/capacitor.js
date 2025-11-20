/**
 * Capacitor Mobile Utilities
 * Provides helper functions for mobile-specific features (iOS and Android)
 */

import { Capacitor } from '@capacitor/core';

// Check if running in Capacitor environment
export const isCapacitor = () => {
  return Capacitor.isNativePlatform();
};

// Check if running on web
export const isWeb = () => {
  return !isCapacitor();
};

// Get platform
export const getPlatform = () => {
  return Capacitor.getPlatform(); // 'ios', 'android', or 'web'
};

// Check if iOS
export const isIOS = () => {
  return getPlatform() === 'ios';
};

// Check if Android
export const isAndroid = () => {
  return getPlatform() === 'android';
};

// Status Bar utilities
export const statusBar = {
  // Set status bar style
  setStyle: async (style = 'dark') => {
    if (!isCapacitor()) return;
    try {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      const styleMap = {
        light: Style.Light,
        dark: Style.Dark,
        default: Style.Default
      };
      await StatusBar.setStyle({ style: styleMap[style] || Style.Dark });
    } catch (error) {
      console.error('Failed to set status bar style:', error);
    }
  },

  // Set background color
  setBackgroundColor: async (color) => {
    if (!isCapacitor() || !isAndroid()) return;
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.setBackgroundColor({ color });
    } catch (error) {
      console.error('Failed to set status bar color:', error);
    }
  },

  // Show status bar
  show: async () => {
    if (!isCapacitor()) return;
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.show();
    } catch (error) {
      console.error('Failed to show status bar:', error);
    }
  },

  // Hide status bar
  hide: async () => {
    if (!isCapacitor()) return;
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.hide();
    } catch (error) {
      console.error('Failed to hide status bar:', error);
    }
  },

  // Get status bar info
  getInfo: async () => {
    if (!isCapacitor()) return null;
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      return await StatusBar.getInfo();
    } catch (error) {
      console.error('Failed to get status bar info:', error);
      return null;
    }
  },

  // Set overlay mode
  setOverlaysWebView: async (overlays = false) => {
    if (!isCapacitor()) return;
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.setOverlaysWebView({ overlay: overlays });
    } catch (error) {
      console.error('Failed to set status bar overlay:', error);
    }
  }
};

// Keyboard utilities
export const keyboard = {
  // Show keyboard
  show: async () => {
    if (!isCapacitor()) return;
    try {
      const { Keyboard } = await import('@capacitor/keyboard');
      await Keyboard.show();
    } catch (error) {
      console.error('Failed to show keyboard:', error);
    }
  },

  // Hide keyboard
  hide: async () => {
    if (!isCapacitor()) return;
    try {
      const { Keyboard } = await import('@capacitor/keyboard');
      await Keyboard.hide();
    } catch (error) {
      console.error('Failed to hide keyboard:', error);
    }
  },

  // Set keyboard style
  setStyle: async (style = 'dark') => {
    if (!isCapacitor() || !isIOS()) return;
    try {
      const { Keyboard, KeyboardStyle } = await import('@capacitor/keyboard');
      const styleMap = {
        light: KeyboardStyle.Light,
        dark: KeyboardStyle.Dark,
        default: KeyboardStyle.Default
      };
      await Keyboard.setStyle({ style: styleMap[style] || KeyboardStyle.Dark });
    } catch (error) {
      console.error('Failed to set keyboard style:', error);
    }
  },

  // Set accessory bar visibility (iOS only)
  setAccessoryBarVisible: async (visible = true) => {
    if (!isCapacitor() || !isIOS()) return;
    try {
      const { Keyboard } = await import('@capacitor/keyboard');
      await Keyboard.setAccessoryBarVisible({ isVisible: visible });
    } catch (error) {
      console.error('Failed to set accessory bar visibility:', error);
    }
  },

  // Set resize mode
  setResizeMode: async (mode = 'native') => {
    if (!isCapacitor()) return;
    try {
      const { Keyboard, KeyboardResize } = await import('@capacitor/keyboard');
      const modeMap = {
        native: KeyboardResize.Native,
        body: KeyboardResize.Body,
        ionic: KeyboardResize.Ionic,
        none: KeyboardResize.None
      };
      await Keyboard.setResizeMode({ mode: modeMap[mode] || KeyboardResize.Native });
    } catch (error) {
      console.error('Failed to set keyboard resize mode:', error);
    }
  },

  // Listen for keyboard events
  addListener: async (event, callback) => {
    if (!isCapacitor()) return () => {};
    try {
      const { Keyboard } = await import('@capacitor/keyboard');
      const listener = await Keyboard.addListener(event, callback);
      return () => listener.remove();
    } catch (error) {
      console.error('Failed to add keyboard listener:', error);
      return () => {};
    }
  }
};

// Haptics utilities
export const haptics = {
  // Light impact
  impact: async (style = 'medium') => {
    if (!isCapacitor()) return;
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const styleMap = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy
      };
      await Haptics.impact({ style: styleMap[style] || ImpactStyle.Medium });
    } catch (error) {
      console.error('Failed to trigger haptic impact:', error);
    }
  },

  // Notification feedback
  notification: async (type = 'success') => {
    if (!isCapacitor()) return;
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      const typeMap = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error
      };
      await Haptics.notification({ type: typeMap[type] || NotificationType.Success });
    } catch (error) {
      console.error('Failed to trigger haptic notification:', error);
    }
  },

  // Vibrate pattern
  vibrate: async (duration = 300) => {
    if (!isCapacitor()) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.error('Failed to vibrate:', error);
    }
  },

  // Selection changed (light tap)
  selectionStart: async () => {
    if (!isCapacitor()) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionStart();
    } catch (error) {
      console.error('Failed to trigger selection haptic:', error);
    }
  },

  selectionChanged: async () => {
    if (!isCapacitor()) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionChanged();
    } catch (error) {
      console.error('Failed to trigger selection changed haptic:', error);
    }
  },

  selectionEnd: async () => {
    if (!isCapacitor()) return;
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionEnd();
    } catch (error) {
      console.error('Failed to trigger selection end haptic:', error);
    }
  }
};

// App utilities
export const app = {
  // Get app info
  getInfo: async () => {
    if (!isCapacitor()) return { name: 'Imtiaz Trading Platform', version: 'web', build: 'web' };
    try {
      const { App } = await import('@capacitor/app');
      return await App.getInfo();
    } catch (error) {
      console.error('Failed to get app info:', error);
      return null;
    }
  },

  // Get app state
  getState: async () => {
    if (!isCapacitor()) return { isActive: true };
    try {
      const { App } = await import('@capacitor/app');
      return await App.getState();
    } catch (error) {
      console.error('Failed to get app state:', error);
      return null;
    }
  },

  // Exit app (Android only)
  exitApp: async () => {
    if (!isCapacitor() || !isAndroid()) return;
    try {
      const { App } = await import('@capacitor/app');
      await App.exitApp();
    } catch (error) {
      console.error('Failed to exit app:', error);
    }
  },

  // Add app state change listener
  addStateChangeListener: async (callback) => {
    if (!isCapacitor()) return () => {};
    try {
      const { App } = await import('@capacitor/app');
      const listener = await App.addListener('appStateChange', callback);
      return () => listener.remove();
    } catch (error) {
      console.error('Failed to add app state listener:', error);
      return () => {};
    }
  },

  // Add back button listener (Android only)
  addBackButtonListener: async (callback) => {
    if (!isCapacitor() || !isAndroid()) return () => {};
    try {
      const { App } = await import('@capacitor/app');
      const listener = await App.addListener('backButton', callback);
      return () => listener.remove();
    } catch (error) {
      console.error('Failed to add back button listener:', error);
      return () => {};
    }
  }
};

// Splash Screen utilities
export const splashScreen = {
  // Show splash screen
  show: async (options = {}) => {
    if (!isCapacitor()) return;
    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.show({
        autoHide: false,
        ...options
      });
    } catch (error) {
      console.error('Failed to show splash screen:', error);
    }
  },

  // Hide splash screen
  hide: async (options = {}) => {
    if (!isCapacitor()) return;
    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide({
        fadeOutDuration: 200,
        ...options
      });
    } catch (error) {
      console.error('Failed to hide splash screen:', error);
    }
  }
};

// Safe area utilities
export const safeArea = {
  // Get safe area insets
  getInsets: () => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue('--safe-area-inset-top')) || 0,
      right: parseInt(style.getPropertyValue('--safe-area-inset-right')) || 0,
      bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom')) || 0,
      left: parseInt(style.getPropertyValue('--safe-area-inset-left')) || 0
    };
  },

  // Check if device has notch
  hasNotch: () => {
    const insets = safeArea.getInsets();
    return insets.top > 20 || insets.bottom > 0;
  }
};

// Initialize mobile app with best defaults
export const initializeMobileApp = async () => {
  if (!isCapacitor()) return;

  try {
    // Hide splash screen after app loads
    await splashScreen.hide();

    // Set status bar style
    await statusBar.setStyle('dark');
    await statusBar.setBackgroundColor('#0f172a');
    await statusBar.setOverlaysWebView(false);

    // Set keyboard style and behavior
    await keyboard.setStyle('dark');
    await keyboard.setResizeMode('native');
    if (isIOS()) {
      await keyboard.setAccessoryBarVisible(true);
    }

    console.log('Mobile app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mobile app:', error);
  }
};

// Export all utilities
export default {
  isCapacitor,
  isWeb,
  getPlatform,
  isIOS,
  isAndroid,
  statusBar,
  keyboard,
  haptics,
  app,
  splashScreen,
  safeArea,
  initializeMobileApp
};
