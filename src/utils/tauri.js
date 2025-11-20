/**
 * Tauri Desktop Utilities
 * Provides helper functions for desktop-specific features
 */

// Check if running in Tauri environment
export const isTauri = () => {
  return window.__TAURI__ !== undefined;
};

// Check if running as web app
export const isWeb = () => {
  return !isTauri();
};

// Get platform information
export const getPlatform = async () => {
  if (!isTauri()) return 'web';

  try {
    const { platform } = await import('@tauri-apps/plugin-os');
    return await platform();
  } catch (error) {
    console.error('Failed to get platform:', error);
    return 'unknown';
  }
};

// Window management utilities
export const windowUtils = {
  // Minimize window
  minimize: async () => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  },

  // Maximize/unmaximize window
  toggleMaximize: async () => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const window = getCurrentWindow();
      const isMaximized = await window.isMaximized();
      if (isMaximized) {
        await window.unmaximize();
      } else {
        await window.maximize();
      }
    } catch (error) {
      console.error('Failed to toggle maximize:', error);
    }
  },

  // Close window
  close: async () => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  },

  // Set window title
  setTitle: async (title) => {
    if (!isTauri()) {
      document.title = title;
      return;
    }
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().setTitle(title);
    } catch (error) {
      console.error('Failed to set window title:', error);
    }
  },

  // Get window size
  getSize: async () => {
    if (!isTauri()) {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const size = await getCurrentWindow().innerSize();
      return { width: size.width, height: size.height };
    } catch (error) {
      console.error('Failed to get window size:', error);
      return null;
    }
  },

  // Set window size
  setSize: async (width, height) => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      const { LogicalSize } = await import('@tauri-apps/api/dpi');
      await getCurrentWindow().setSize(new LogicalSize(width, height));
    } catch (error) {
      console.error('Failed to set window size:', error);
    }
  },

  // Center window
  center: async () => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().center();
    } catch (error) {
      console.error('Failed to center window:', error);
    }
  },

  // Set fullscreen
  setFullscreen: async (fullscreen) => {
    if (!isTauri()) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().setFullscreen(fullscreen);
    } catch (error) {
      console.error('Failed to set fullscreen:', error);
    }
  },
};

// App version utilities
export const getVersion = async () => {
  if (!isTauri()) return 'web';

  try {
    const { getVersion } = await import('@tauri-apps/api/app');
    return await getVersion();
  } catch (error) {
    console.error('Failed to get app version:', error);
    return 'unknown';
  }
};

// Dialog utilities
export const dialog = {
  // Show message dialog
  message: async (message, title = 'Message') => {
    if (!isTauri()) {
      alert(message);
      return;
    }
    try {
      const { message: showMessage } = await import('@tauri-apps/plugin-dialog');
      await showMessage(message, { title });
    } catch (error) {
      console.error('Failed to show message:', error);
      alert(message);
    }
  },

  // Show confirmation dialog
  confirm: async (message, title = 'Confirm') => {
    if (!isTauri()) {
      return window.confirm(message);
    }
    try {
      const { ask } = await import('@tauri-apps/plugin-dialog');
      return await ask(message, { title });
    } catch (error) {
      console.error('Failed to show confirm dialog:', error);
      return window.confirm(message);
    }
  },
};

// Notification utilities
export const notification = {
  // Check if notifications are supported
  isSupported: () => {
    return isTauri() || ('Notification' in window);
  },

  // Request permission
  requestPermission: async () => {
    if (!notification.isSupported()) return false;

    if (isTauri()) {
      try {
        const { isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification');
        let permission = await isPermissionGranted();
        if (!permission) {
          permission = await requestPermission();
        }
        return permission;
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    } else {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  },

  // Send notification
  send: async (title, body, options = {}) => {
    if (!notification.isSupported()) {
      console.warn('Notifications not supported');
      return;
    }

    if (isTauri()) {
      try {
        const { sendNotification } = await import('@tauri-apps/plugin-notification');
        await sendNotification({ title, body, ...options });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    } else {
      const permission = await notification.requestPermission();
      if (permission) {
        new Notification(title, { body, ...options });
      }
    }
  },
};

// File system utilities (for future use)
export const fileSystem = {
  // Open file dialog
  openFile: async (options = {}) => {
    if (!isTauri()) {
      console.warn('File system access only available in desktop app');
      return null;
    }
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      return await open(options);
    } catch (error) {
      console.error('Failed to open file dialog:', error);
      return null;
    }
  },

  // Save file dialog
  saveFile: async (options = {}) => {
    if (!isTauri()) {
      console.warn('File system access only available in desktop app');
      return null;
    }
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      return await save(options);
    } catch (error) {
      console.error('Failed to save file dialog:', error);
      return null;
    }
  },
};

// Clipboard utilities
export const clipboard = {
  // Write text to clipboard
  writeText: async (text) => {
    if (!isTauri()) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Failed to write to clipboard:', error);
        return false;
      }
    }
    try {
      const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
      await writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to write to clipboard:', error);
      return false;
    }
  },

  // Read text from clipboard
  readText: async () => {
    if (!isTauri()) {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        console.error('Failed to read from clipboard:', error);
        return '';
      }
    }
    try {
      const { readText } = await import('@tauri-apps/plugin-clipboard-manager');
      return await readText();
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return '';
    }
  },
};

// Export all utilities
export default {
  isTauri,
  isWeb,
  getPlatform,
  getVersion,
  windowUtils,
  dialog,
  notification,
  fileSystem,
  clipboard,
};
