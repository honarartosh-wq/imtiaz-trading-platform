# Mobile App Project Setup Guide

## Prerequisites

### Development Environment

#### macOS (Required for iOS development)
- **Node.js** 18+ (LTS version)
- **npm** or **yarn**
- **Xcode** 14+ (for iOS)
- **CocoaPods** (iOS dependency manager)
- **Watchman** (file watching service)

#### Windows/Linux (Android only)
- **Node.js** 18+ (LTS version)
- **npm** or **yarn**
- **Android Studio** with:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)
- **Java Development Kit (JDK)** 11

### Install Global Dependencies

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI (for builds)
npm install -g eas-cli

# macOS only - Install CocoaPods
sudo gem install cocoapods

# Install Watchman (macOS)
brew install watchman
```

## Project Initialization

### Option 1: Expo (Recommended)

```bash
# Create new Expo project with TypeScript
npx create-expo-app imtiaz-trading-mobile --template expo-template-blank-typescript

# Navigate to project
cd imtiaz-trading-mobile

# Install additional dependencies
npm install
```

### Option 2: React Native CLI

```bash
# Create new React Native project
npx react-native init ImtiazTradingMobile --template react-native-template-typescript

# Navigate to project
cd ImtiazTradingMobile

# Install CocoaPods dependencies (iOS)
cd ios && pod install && cd ..
```

## Install Core Dependencies

### Navigation
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
```

### State Management
```bash
npm install @reduxjs/toolkit react-redux redux-persist
npm install @react-native-async-storage/async-storage
```

### API & Networking
```bash
npm install axios
npm install socket.io-client
```

### UI Components
```bash
npm install react-native-paper
npm install react-native-vector-icons
npm install react-native-elements
```

### Forms & Validation
```bash
npm install react-hook-form yup
npm install @hookform/resolvers
```

### Security
```bash
npm install react-native-keychain
npm install react-native-biometrics
```

### File Handling
```bash
npm install react-native-document-picker
npm install react-native-image-picker
npm install react-native-fs
```

### Charts & Visualization
```bash
npm install victory-native
npm install react-native-svg
```

### Push Notifications
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
```

### Development Tools
```bash
npm install --save-dev @types/react @types/react-native
npm install --save-dev eslint prettier
npm install --save-dev jest @testing-library/react-native
npm install --save-dev detox
```

## Project Structure Setup

### Create Directory Structure

```bash
# Create main directories
mkdir -p src/{api,components,screens,navigation,store,hooks,utils,constants,types,services}

# Create subdirectories
mkdir -p src/components/{common,charts,forms,layout}
mkdir -p src/screens/{auth,dashboard,trading,transactions,profile}
mkdir -p src/store/{slices,api}
mkdir -p assets/{images,fonts,icons}
```

### Create Base Files

#### src/api/client.ts
```typescript
import axios from 'axios';
import { getTokens, saveTokens, clearTokens } from '../utils/storage';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = await getTokens();
        if (tokens?.refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: tokens.refreshToken,
          });

          const { access_token } = response.data;
          await saveTokens({ accessToken: access_token, refreshToken: tokens.refreshToken });

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await clearTokens();
        // Navigate to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

#### src/utils/storage.ts
```typescript
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKENS_SERVICE = 'imtiaz.trading.tokens';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const saveTokens = async (tokens: Tokens): Promise<void> => {
  await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
    service: TOKENS_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const getTokens = async (): Promise<Tokens | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: TOKENS_SERVICE,
    });

    if (credentials) {
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: TOKENS_SERVICE });
};

export const setItem = async (key: string, value: any): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
```

#### src/store/store.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import tradingReducer from './slices/tradingSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'ui'], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  trading: tradingReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### src/navigation/RootNavigator.tsx
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootState } from '../store/store';

const RootNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
```

#### App.tsx
```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
```

## Configuration Files

### .env.development
```bash
API_BASE_URL=http://localhost:8000
WS_BASE_URL=ws://localhost:8000
ENVIRONMENT=development
```

### .env.production
```bash
API_BASE_URL=https://api.imtiaz-trading.com
WS_BASE_URL=wss://api.imtiaz-trading.com
ENVIRONMENT=production
```

### .eslintrc.js
```javascript
module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
```

### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2017"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "Imtiaz Trading Platform"
3. Add Android app (package: com.imtiaztrading.mobile)
4. Add iOS app (bundle ID: com.imtiaztrading.mobile)
5. Download `google-services.json` (Android)
6. Download `GoogleService-Info.plist` (iOS)

### 2. Configure Android
```bash
# Place google-services.json in android/app/
cp google-services.json android/app/
```

### 3. Configure iOS
```bash
# Place GoogleService-Info.plist in ios/ImtiazTradingMobile/
cp GoogleService-Info.plist ios/ImtiazTradingMobile/
```

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
# Start Android emulator first, then:
npm run android

# Or for specific device
npm run android -- --deviceId=<device-id>
```

### Run on iOS (macOS only)
```bash
# Install pods first
cd ios && pod install && cd ..

# Run on simulator
npm run ios

# Or for specific simulator
npm run ios -- --simulator="iPhone 14 Pro"
```

### Run with Expo
```bash
# Start Expo
npm start

# Scan QR code with Expo Go app (Android/iOS)
# Or press 'a' for Android emulator
# Or press 'i' for iOS simulator
```

## Building for Production

### Android APK/AAB
```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Generate release AAB (for Play Store)
./gradlew bundleRelease

# Output locations:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS IPA
```bash
# Open Xcode
open ios/ImtiazTradingMobile.xcworkspace

# 1. Select "Any iOS Device" as target
# 2. Product → Archive
# 3. Distribute App → App Store Connect
# 4. Upload to TestFlight
```

### Using EAS Build (Expo)
```bash
# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

## Testing

### Run Unit Tests
```bash
npm test

# With coverage
npm run test:coverage
```

### Run E2E Tests
```bash
# Build app for testing
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug
```

## Debugging

### React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Run debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper
```bash
# Flipper is included with React Native
# Just open the app and Flipper will connect automatically
```

### Reactotron
```bash
# Install Reactotron
npm install --save-dev reactotron-react-native

# Configure in src/config/reactotron.ts
# Launch Reactotron desktop app
```

## Troubleshooting

### Clear Cache
```bash
# Clear Metro bundler cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Clear iOS build
cd ios && rm -rf build && cd ..

# Clear Android build
cd android && ./gradlew clean && cd ..
```

### Reinstall Dependencies
```bash
# Remove node_modules and lock files
rm -rf node_modules package-lock.json yarn.lock

# Reinstall
npm install

# iOS pods
cd ios && pod install && cd ..
```

## Next Steps

1. ✅ Project initialized
2. ⏭️ Implement authentication screens
3. ⏭️ Set up API integration
4. ⏭️ Build dashboard screen
5. ⏭️ Implement trading features
6. ⏭️ Add push notifications
7. ⏭️ Set up biometric authentication
8. ⏭️ Testing and QA
9. ⏭️ App Store submission

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
