# Imtiaz Trading Platform - Mobile App Architecture

## Overview

This document outlines the architecture for the React Native mobile application for the Imtiaz Trading Platform. The mobile app provides client users with full access to trading features on Android and iOS devices.

## Platform Distribution

### Web Application (Browser/Windows)
- **Admin Dashboard** - Desktop only
- **Manager Dashboard** - Desktop only
- **Client Dashboard** - Available on web (full features)

### Mobile Application (React Native)
- **Client Dashboard** - Android & iOS (same features as web)
- Clients can use the same account on both web and mobile

## Technology Stack

### Core Framework
- **React Native** - Cross-platform mobile development
- **Expo** (Recommended for faster development and easier deployment)
- **TypeScript** - Type safety and better developer experience

### State Management
- **Redux Toolkit** - Centralized state management
- **RTK Query** - API calls and caching
- **Redux Persist** - Persist state across app restarts

### Navigation
- **React Navigation v6** - Native navigation
  - Stack Navigator - Screen transitions
  - Bottom Tab Navigator - Main navigation
  - Drawer Navigator (optional) - Side menu

### UI Components
- **React Native Paper** - Material Design components
- **React Native Elements** - Additional UI components
- **Victory Native** - Charts and graphs for trading data
- **React Native Reanimated** - Smooth animations

### Authentication & Security
- **React Native Keychain** - Secure credential storage
- **React Native Biometrics** - Fingerprint/Face ID
- **JWT Token Management** - Same as web (access + refresh tokens)

### Real-time Features
- **Socket.io Client** - Real-time price updates
- **Push Notifications:**
  - **Firebase Cloud Messaging (FCM)** - Android & iOS
  - **React Native Firebase** - Native implementation

### Forms & Validation
- **React Hook Form** - Form management
- **Yup** - Schema validation

### File Handling
- **React Native Document Picker** - KYC document uploads
- **React Native Image Picker** - Camera/gallery access
- **React Native FS** - File system operations

### Development Tools
- **ESLint + Prettier** - Code quality
- **Jest** - Unit testing
- **Detox** - E2E testing
- **Reactotron** - Debugging

## Project Structure

```
imtiaz-trading-mobile/
├── src/
│   ├── api/                    # API integration
│   │   ├── client.ts          # Axios instance
│   │   ├── auth.ts            # Auth endpoints
│   │   ├── trading.ts         # Trading endpoints
│   │   ├── transactions.ts    # Transaction endpoints
│   │   └── interceptors.ts    # Request/response interceptors
│   │
│   ├── components/            # Reusable components
│   │   ├── common/           # Buttons, inputs, cards, etc.
│   │   ├── charts/           # Trading charts
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   │
│   ├── screens/              # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── KYCUploadScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── trading/
│   │   │   ├── MarketScreen.tsx
│   │   │   ├── TradeScreen.tsx
│   │   │   └── PositionsScreen.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionsScreen.tsx
│   │   │   ├── DepositScreen.tsx
│   │   │   └── WithdrawScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── navigation/           # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── store/               # Redux store
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── tradingSlice.ts
│   │   │   └── userSlice.ts
│   │   └── api/
│   │       └── apiSlice.ts  # RTK Query API
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useBiometrics.ts
│   │   └── useNotifications.ts
│   │
│   ├── utils/              # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── storage.ts
│   │
│   ├── constants/          # Constants
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── api.ts
│   │
│   ├── types/             # TypeScript types
│   │   ├── auth.ts
│   │   ├── trading.ts
│   │   └── user.ts
│   │
│   └── services/          # External services
│       ├── notifications.ts
│       ├── websocket.ts
│       └── analytics.ts
│
├── assets/               # Images, fonts, icons
├── __tests__/           # Tests
├── android/             # Android native code
├── ios/                 # iOS native code
├── app.json            # Expo configuration
├── package.json
└── tsconfig.json
```

## Architecture Patterns

### 1. Component Architecture
- **Presentational Components** - UI only, no business logic
- **Container Components** - Connected to Redux, handle business logic
- **Screen Components** - Full screen views
- **HOC (Higher Order Components)** - For authentication, error boundaries

### 2. State Management
```typescript
// Redux Store Structure
{
  auth: {
    user: User | null,
    tokens: { access: string, refresh: string } | null,
    isAuthenticated: boolean,
    kycStatus: 'pending' | 'approved' | 'rejected',
    loading: boolean,
    error: string | null
  },
  trading: {
    positions: Position[],
    trades: Trade[],
    markets: Market[],
    selectedMarket: Market | null,
    loading: boolean
  },
  transactions: {
    history: Transaction[],
    pending: Transaction[],
    balance: number
  },
  ui: {
    theme: 'light' | 'dark',
    language: string,
    notifications: Notification[]
  }
}
```

### 3. API Integration
- Use the same backend API as web application
- Base URL configurable via environment variables
- Automatic token refresh on 401 errors
- Request/response interceptors for auth headers
- Error handling and retry logic

### 4. Offline Support
- Cache user data with Redux Persist
- Queue transactions when offline
- Sync when connection restored
- Show offline indicator

## Security Implementation

### 1. Token Storage
```typescript
// Secure token storage using React Native Keychain
import * as Keychain from 'react-native-keychain';

// Save tokens
await Keychain.setGenericPassword('auth', JSON.stringify({
  accessToken,
  refreshToken
}), {
  service: 'imtiaz.trading.tokens',
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
});

// Retrieve tokens
const credentials = await Keychain.getGenericPassword({
  service: 'imtiaz.trading.tokens'
});
```

### 2. Biometric Authentication
```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

// Check if biometrics available
const { available, biometryType } = await rnBiometrics.isSensorAvailable();

// Authenticate
const { success } = await rnBiometrics.simplePrompt({
  promptMessage: 'Confirm fingerprint to login'
});
```

### 3. Certificate Pinning
- Implement SSL pinning to prevent MITM attacks
- Use `react-native-ssl-pinning`

## Real-Time Updates

### WebSocket Connection
```typescript
import io from 'socket.io-client';

const socket = io(API_BASE_URL, {
  auth: {
    token: accessToken
  },
  transports: ['websocket']
});

// Subscribe to price updates
socket.on('price_update', (data) => {
  dispatch(updateMarketPrice(data));
});

// Subscribe to trade updates
socket.on('trade_update', (data) => {
  dispatch(updateTrade(data));
});
```

### Push Notifications
```typescript
// Firebase Cloud Messaging setup
import messaging from '@react-native-firebase/messaging';

// Request permission
const authStatus = await messaging().requestPermission();

// Get FCM token
const fcmToken = await messaging().getToken();

// Send token to backend
await api.post('/api/users/fcm-token', { token: fcmToken });

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
  showNotification(remoteMessage);
});

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Handle notification
});
```

## Performance Optimization

### 1. List Rendering
- Use `FlatList` with `getItemLayout` for fixed height items
- Implement `windowSize` and `maxToRenderPerBatch` optimization
- Use `memo` for list item components

### 2. Image Optimization
- Use `react-native-fast-image` for caching
- Lazy load images
- Compress uploaded images before sending

### 3. Navigation Optimization
- Use `lazy` loading for screens
- Preload critical screens
- Optimize stack navigator depth

### 4. Bundle Size
- Use code splitting
- Remove unused dependencies
- Enable Hermes JavaScript engine

## Platform-Specific Features

### Android
- Material Design guidelines
- Android navigation gestures
- Google Play In-App Updates
- ProGuard for code obfuscation

### iOS
- iOS Human Interface Guidelines
- Native iOS navigation feel
- App Store requirements compliance
- Testflight for beta testing

## Development Workflow

### 1. Environment Setup
```bash
# Install dependencies
npm install

# iOS setup (Mac only)
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios

# Start Metro bundler
npm start
```

### 2. Environment Variables
```
# .env.development
API_BASE_URL=http://localhost:8000
WS_BASE_URL=ws://localhost:8000
ENVIRONMENT=development

# .env.production
API_BASE_URL=https://api.imtiaz-trading.com
WS_BASE_URL=wss://api.imtiaz-trading.com
ENVIRONMENT=production
```

### 3. Build Process
```bash
# Android
npm run build:android

# iOS
npm run build:ios

# Expo
eas build --platform android
eas build --platform ios
```

## Testing Strategy

### 1. Unit Tests
- Test Redux reducers and actions
- Test utility functions
- Test custom hooks
- Coverage target: 80%+

### 2. Integration Tests
- Test API calls
- Test navigation flows
- Test form submissions

### 3. E2E Tests
```typescript
// Detox example
describe('Login Flow', () => {
  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('client@example.com');
    await element(by.id('password-input')).typeText('client123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('dashboard'))).toBeVisible();
  });
});
```

## Deployment

### Android
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Internal testing → Closed testing → Open testing → Production
4. Gradual rollout (10% → 50% → 100%)

### iOS
1. Archive app in Xcode
2. Upload to App Store Connect
3. Testflight for beta testing
4. Submit for App Store review
5. Phased release

## Monitoring & Analytics

### Crash Reporting
- **Sentry** - Error tracking
- **Firebase Crashlytics** - Crash reports

### Analytics
- **Firebase Analytics** - User behavior
- **Mixpanel** - Event tracking
- Custom events for trading actions

### Performance Monitoring
- **React Native Performance** - JS thread monitoring
- **Firebase Performance** - App startup time, network requests

## API Compatibility

The mobile app uses the same API as the web application:

### Shared Endpoints
- `/api/auth/login` - Login
- `/api/auth/register` - Registration with KYC
- `/api/auth/refresh` - Token refresh
- `/api/accounts` - Account management
- `/api/transactions` - Deposits, withdrawals, transfers
- `/api/trades` - Trading operations
- `/api/users/me` - User profile

### Mobile-Specific Endpoints (Optional)
- `/api/mobile/fcm-token` - Register FCM token
- `/api/mobile/device-info` - Device registration
- `/api/mobile/app-version` - Version check for forced updates

## Feature Parity Matrix

| Feature | Web | Mobile | Notes |
|---------|-----|--------|-------|
| Login | ✅ | ✅ | Mobile adds biometric |
| Registration | ✅ | ✅ | Same KYC process |
| Dashboard | ✅ | ✅ | Mobile optimized layout |
| Trading | ✅ | ✅ | Touch-optimized UI |
| Transactions | ✅ | ✅ | Full feature parity |
| Charts | ✅ | ✅ | Mobile responsive charts |
| Profile | ✅ | ✅ | Same functionality |
| Notifications | Limited | ✅ | Push notifications |
| Offline Mode | ❌ | ✅ | Mobile-only feature |
| Biometrics | ❌ | ✅ | Mobile-only feature |

## Future Enhancements

### Phase 1 (MVP)
- ✅ Authentication & KYC
- ✅ Dashboard
- ✅ Basic trading
- ✅ Transactions
- ✅ Push notifications

### Phase 2
- Real-time price charts
- Advanced order types (limit, stop-loss)
- Price alerts
- Trading signals

### Phase 3
- Social trading features
- Copy trading
- Advanced analytics
- AI-powered insights

### Phase 4
- Widgets
- Apple Watch app
- Wear OS app
- Tablet optimization

## Conclusion

This architecture provides a scalable, secure, and performant foundation for the Imtiaz Trading Platform mobile app. The use of React Native with Expo enables rapid development while maintaining native performance and user experience on both Android and iOS platforms.
