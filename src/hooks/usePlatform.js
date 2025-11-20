/**
 * Unified Platform Detection Hook
 * Detects whether app is running on Web, Desktop (Tauri), or Mobile (Capacitor)
 */

import { useDesktopInfo } from './useTauri';
import { useMobileInfo } from './useCapacitor';

/**
 * Unified hook to get platform information across all environments
 * @returns {Object} Platform information
 */
export function usePlatformInfo() {
  const desktopInfo = useDesktopInfo();
  const mobileInfo = useMobileInfo();

  // Determine primary platform
  let primaryPlatform = 'web';
  if (desktopInfo.isTauri) {
    primaryPlatform = 'desktop';
  } else if (mobileInfo.isCapacitor) {
    primaryPlatform = 'mobile';
  }

  return {
    // Primary platform
    platform: primaryPlatform,
    isWeb: primaryPlatform === 'web',
    isDesktop: primaryPlatform === 'desktop',
    isMobile: primaryPlatform === 'mobile',

    // Desktop (Tauri) specific
    desktop: {
      isActive: desktopInfo.isTauri,
      platform: desktopInfo.platform,
      version: desktopInfo.version,
      loading: desktopInfo.loading
    },

    // Mobile (Capacitor) specific
    mobile: {
      isActive: mobileInfo.isCapacitor,
      platform: mobileInfo.platform,
      isIOS: mobileInfo.isIOS,
      isAndroid: mobileInfo.isAndroid,
      appInfo: mobileInfo.appInfo,
      isAppActive: mobileInfo.isActive,
      safeArea: mobileInfo.safeArea,
      orientation: mobileInfo.orientation,
      isPortrait: mobileInfo.isPortrait,
      isLandscape: mobileInfo.isLandscape,
      loading: mobileInfo.loading
    },

    // Combined version info
    appVersion: desktopInfo.isTauri
      ? desktopInfo.version
      : mobileInfo.isCapacitor && mobileInfo.appInfo
      ? mobileInfo.appInfo.version
      : 'web',

    // Combined name
    appName: mobileInfo.isCapacitor && mobileInfo.appInfo
      ? mobileInfo.appInfo.name
      : 'Imtiaz Trading Platform'
  };
}

/**
 * Simple hook to get just the platform type
 * @returns {string} 'web' | 'desktop' | 'mobile'
 */
export function usePlatformType() {
  const { platform } = usePlatformInfo();
  return platform;
}

/**
 * Hook to check if running as native app (desktop or mobile)
 * @returns {boolean}
 */
export function useIsNativeApp() {
  const { isDesktop, isMobile } = usePlatformInfo();
  return isDesktop || isMobile;
}

export default {
  usePlatformInfo,
  usePlatformType,
  useIsNativeApp
};
