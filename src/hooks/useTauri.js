/**
 * Custom React Hook for Tauri Desktop Features
 * Provides easy access to desktop functionality in React components
 */

import { useState, useEffect } from 'react';
import { isTauri, isWeb, getPlatform, getVersion } from '../utils/tauri';

/**
 * Hook to detect if app is running in Tauri
 */
export function useIsTauri() {
  return isTauri();
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
  const [platform, setPlatform] = useState('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatform()
      .then(setPlatform)
      .finally(() => setLoading(false));
  }, []);

  return { platform, loading };
}

/**
 * Hook to get app version
 */
export function useAppVersion() {
  const [version, setVersion] = useState('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .finally(() => setLoading(false));
  }, []);

  return { version, loading };
}

/**
 * Hook to manage window state
 */
export function useWindowState() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;

    let unlistenMaximize;
    let unlistenFullscreen;

    const setupListeners = async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const window = getCurrentWindow();

        // Check initial states
        const maximized = await window.isMaximized();
        const fullscreen = await window.isFullscreen();
        setIsMaximized(maximized);
        setIsFullscreen(fullscreen);

        // Listen for window state changes
        unlistenMaximize = await window.onResized(async () => {
          const maximized = await window.isMaximized();
          setIsMaximized(maximized);
        });

      } catch (error) {
        console.error('Failed to setup window listeners:', error);
      }
    };

    setupListeners();

    return () => {
      if (unlistenMaximize) unlistenMaximize();
      if (unlistenFullscreen) unlistenFullscreen();
    };
  }, []);

  return { isMaximized, isFullscreen };
}

/**
 * Hook to get window size
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = async () => {
      if (isTauri()) {
        try {
          const { getCurrentWindow } = await import('@tauri-apps/api/window');
          const window = getCurrentWindow();
          const innerSize = await window.innerSize();
          setSize({ width: innerSize.width, height: innerSize.height });
        } catch (error) {
          console.error('Failed to get window size:', error);
        }
      } else {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };

    updateSize();

    if (isTauri()) {
      let unlisten;
      const setupListener = async () => {
        try {
          const { getCurrentWindow } = await import('@tauri-apps/api/window');
          unlisten = await getCurrentWindow().onResized(() => {
            updateSize();
          });
        } catch (error) {
          console.error('Failed to setup resize listener:', error);
        }
      };
      setupListener();
      return () => {
        if (unlisten) unlisten();
      };
    } else {
      const handleResize = () => updateSize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return size;
}

/**
 * Hook to manage app theme based on system preferences
 */
export function useSystemTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (!isTauri()) {
      // Use web API for system theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Use Tauri API for system theme
      const getTheme = async () => {
        try {
          const { theme: getSystemTheme } = await import('@tauri-apps/plugin-os');
          const systemTheme = await getSystemTheme();
          setTheme(systemTheme || 'light');
        } catch (error) {
          console.error('Failed to get system theme:', error);
        }
      };
      getTheme();
    }
  }, []);

  return theme;
}

/**
 * Hook for desktop environment info
 */
export function useDesktopInfo() {
  const isTauriApp = useIsTauri();
  const { platform, loading: platformLoading } = usePlatform();
  const { version, loading: versionLoading } = useAppVersion();

  return {
    isTauri: isTauriApp,
    isWeb: !isTauriApp,
    platform,
    version,
    loading: platformLoading || versionLoading,
  };
}

export default {
  useIsTauri,
  useIsWeb,
  usePlatform,
  useAppVersion,
  useWindowState,
  useWindowSize,
  useSystemTheme,
  useDesktopInfo,
};
