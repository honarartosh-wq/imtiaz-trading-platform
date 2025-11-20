/**
 * Custom React Hooks for Capacitor Mobile Features
 * Provides easy access to mobile functionality in React components
 */

import { useState, useEffect } from 'react';
import {
  isCapacitor,
  isWeb,
  getPlatform,
  isIOS,
  isAndroid,
  app,
  keyboard,
  safeArea
} from '../utils/capacitor';

/**
 * Hook to detect if app is running in Capacitor
 */
export function useIsCapacitor() {
  return isCapacitor();
}

/**
 * Hook to detect if app is running as web
 */
export function useIsWeb() {
  return isWeb();
}

/**
 * Hook to get platform information
 */
export function usePlatform() {
  const [platform, setPlatform] = useState(getPlatform());

  return {
    platform,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web',
    isMobile: platform === 'ios' || platform === 'android'
  };
}

/**
 * Hook to get app information
 */
export function useAppInfo() {
  const [appInfo, setAppInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    app.getInfo()
      .then(setAppInfo)
      .finally(() => setLoading(false));
  }, []);

  return { appInfo, loading };
}

/**
 * Hook to monitor app state (active/inactive)
 */
export function useAppState() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isCapacitor()) return;

    let removeListener;

    const setupListener = async () => {
      // Get initial state
      const state = await app.getState();
      setIsActive(state.isActive);

      // Listen for state changes
      removeListener = await app.addStateChangeListener((state) => {
        setIsActive(state.isActive);
      });
    };

    setupListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return { isActive };
}

/**
 * Hook to handle Android back button
 */
export function useBackButton(handler) {
  useEffect(() => {
    if (!isAndroid()) return;

    let removeListener;

    const setupListener = async () => {
      removeListener = await app.addBackButtonListener((event) => {
        if (handler) {
          handler(event);
        }
      });
    };

    setupListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, [handler]);
}

/**
 * Hook to monitor keyboard visibility
 */
export function useKeyboard() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!isCapacitor()) return;

    let removeShowListener;
    let removeHideListener;

    const setupListeners = async () => {
      removeShowListener = await keyboard.addListener('keyboardWillShow', (info) => {
        setKeyboardVisible(true);
        setKeyboardHeight(info.keyboardHeight);
      });

      removeHideListener = await keyboard.addListener('keyboardWillHide', () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      });
    };

    setupListeners();

    return () => {
      if (removeShowListener) removeShowListener();
      if (removeHideListener) removeHideListener();
    };
  }, []);

  return {
    isVisible: keyboardVisible,
    height: keyboardHeight,
    hide: keyboard.hide,
    show: keyboard.show
  };
}

/**
 * Hook to get safe area insets
 */
export function useSafeArea() {
  const [insets, setInsets] = useState(safeArea.getInsets());

  useEffect(() => {
    // Update insets on resize (orientation change)
    const handleResize = () => {
      setInsets(safeArea.getInsets());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...insets,
    hasNotch: safeArea.hasNotch()
  };
}

/**
 * Hook to detect screen orientation
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
}

/**
 * Hook for mobile environment info
 */
export function useMobileInfo() {
  const isCapacitorApp = useIsCapacitor();
  const { platform, isIOS: ios, isAndroid: android, isMobile } = usePlatform();
  const { appInfo, loading: appInfoLoading } = useAppInfo();
  const { isActive } = useAppState();
  const safeAreaInsets = useSafeArea();
  const { orientation, isPortrait, isLandscape } = useOrientation();

  return {
    isCapacitor: isCapacitorApp,
    isWeb: !isCapacitorApp,
    platform,
    isIOS: ios,
    isAndroid: android,
    isMobile,
    appInfo,
    isActive,
    safeArea: safeAreaInsets,
    orientation,
    isPortrait,
    isLandscape,
    loading: appInfoLoading
  };
}

/**
 * Hook to handle pull-to-refresh
 */
export function usePullToRefresh(onRefresh, enabled = true) {
  useEffect(() => {
    if (!enabled || !isCapacitor()) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 100) {
        // Threshold reached
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      const pullDistance = currentY - startY;
      if (pullDistance > 100 && onRefresh) {
        await onRefresh();
      }

      isPulling = false;
      startY = 0;
      currentY = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, enabled]);
}

/**
 * Hook to prevent zoom on mobile
 */
export function usePreventZoom() {
  useEffect(() => {
    if (!isCapacitor()) return;

    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('gesturestart', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('gesturestart', preventZoom);
    };
  }, []);
}

export default {
  useIsCapacitor,
  useIsWeb,
  usePlatform,
  useAppInfo,
  useAppState,
  useBackButton,
  useKeyboard,
  useSafeArea,
  useOrientation,
  useMobileInfo,
  usePullToRefresh,
  usePreventZoom
};
