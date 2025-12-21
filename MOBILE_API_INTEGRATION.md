# Mobile App API Integration Strategy

## Overview

This document details how the React Native mobile app integrates with the Imtiaz Trading Platform backend API. The mobile app uses the **exact same REST API** as the web application, ensuring feature parity and consistent behavior across platforms.

## API Base Configuration

### Environment Configuration

```typescript
// src/constants/api.ts
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000',
    wsURL: 'ws://localhost:8000',
    timeout: 10000,
  },
  staging: {
    baseURL: 'https://staging-api.imtiaz-trading.com',
    wsURL: 'wss://staging-api.imtiaz-trading.com',
    timeout: 15000,
  },
  production: {
    baseURL: 'https://api.imtiaz-trading.com',
    wsURL: 'wss://api.imtiaz-trading.com',
    timeout: 15000,
  },
};

export const getAPIConfig = () => {
  const env = process.env.ENVIRONMENT || 'development';
  return API_CONFIG[env];
};
```

## Shared API Endpoints

### Authentication APIs

All authentication endpoints from `src/services/api.js` are used:

#### 1. Register with KYC
```typescript
// src/api/auth.ts
import apiClient from './client';

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  referral_code: string;
  account_type: 'standard' | 'business';
  // KYC Documents
  id_document: File;
  proof_of_address: File;
  business_document?: File;
  tax_document?: File;
}

export const register = async (data: RegisterData) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone || '');
  formData.append('password', data.password);
  formData.append('referral_code', data.referral_code);
  formData.append('account_type', data.account_type);

  // Append KYC documents
  formData.append('id_document', {
    uri: data.id_document.uri,
    type: data.id_document.type,
    name: data.id_document.name,
  } as any);

  formData.append('proof_of_address', {
    uri: data.proof_of_address.uri,
    type: data.proof_of_address.type,
    name: data.proof_of_address.name,
  } as any);

  if (data.account_type === 'business') {
    formData.append('business_document', {
      uri: data.business_document!.uri,
      type: data.business_document!.type,
      name: data.business_document!.name,
    } as any);

    formData.append('tax_document', {
      uri: data.tax_document!.uri,
      type: data.tax_document!.type,
      name: data.tax_document!.name,
    } as any);
  }

  const response = await apiClient.post('/api/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
```

#### 2. Login
```typescript
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};
```

#### 3. Get Current User
```typescript
export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};
```

#### 4. Refresh Token
```typescript
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await apiClient.post('/api/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};
```

### Account APIs

```typescript
// src/api/accounts.ts
export const getAccounts = async () => {
  const response = await apiClient.get('/api/accounts');
  return response.data;
};

export const getAccountById = async (accountId: number) => {
  const response = await apiClient.get(`/api/accounts/${accountId}`);
  return response.data;
};

export const createAccount = async (accountData: any) => {
  const response = await apiClient.post('/api/accounts', accountData);
  return response.data;
};

export const updateAccount = async (accountId: number, updateData: any) => {
  const response = await apiClient.put(`/api/accounts/${accountId}`, updateData);
  return response.data;
};
```

### Transaction APIs

```typescript
// src/api/transactions.ts
export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams(filters as any).toString();
  const response = await apiClient.get(`/api/transactions?${params}`);
  return response.data;
};

export const createDeposit = async (accountId: number, amount: number) => {
  const response = await apiClient.post('/api/transactions/deposit', {
    account_id: accountId,
    amount,
  });
  return response.data;
};

export const createWithdrawal = async (accountId: number, amount: number) => {
  const response = await apiClient.post('/api/transactions/withdraw', {
    account_id: accountId,
    amount,
  });
  return response.data;
};

export const createTransfer = async (
  accountId: number,
  toEmail: string,
  amount: number,
  description = ''
) => {
  const response = await apiClient.post('/api/transactions/transfer', {
    account_id: accountId,
    to_email: toEmail,
    amount,
    description,
  });
  return response.data;
};
```

### Trading APIs

```typescript
// src/api/trading.ts
export const getTrades = async (filters = {}) => {
  const params = new URLSearchParams(filters as any).toString();
  const response = await apiClient.get(`/api/trades?${params}`);
  return response.data;
};

export const createTrade = async (tradeData: any) => {
  const response = await apiClient.post('/api/trades', tradeData);
  return response.data;
};

export const closeTrade = async (tradeId: number, closePrice: number) => {
  const response = await apiClient.post(`/api/trades/${tradeId}/close`, {
    close_price: closePrice,
  });
  return response.data;
};
```

### Branch APIs

```typescript
// src/api/branches.ts
export const getBranches = async () => {
  const response = await apiClient.get('/api/branches');
  return response.data;
};

export const validateReferralCode = async (referralCode: string) => {
  const response = await apiClient.get(`/api/branches/validate/${referralCode}`);
  return response.data;
};
```

## Mobile-Specific Enhancements

### 1. Push Notification Token Registration

```typescript
// src/api/mobile.ts
export const registerFCMToken = async (token: string, deviceInfo: any) => {
  const response = await apiClient.post('/api/mobile/fcm-token', {
    fcm_token: token,
    device_info: deviceInfo,
    platform: Platform.OS,
  });
  return response.data;
};
```

**Backend Endpoint (New):**
```python
@router.post("/api/mobile/fcm-token")
async def register_fcm_token(
    fcm_token: str,
    device_info: dict,
    platform: str,
    user: User = Depends(get_current_user)
):
    # Save FCM token for user
    await save_user_fcm_token(user.id, fcm_token, device_info, platform)
    return {"success": True}
```

### 2. Device Registration

```typescript
export const registerDevice = async (deviceInfo: any) => {
  const response = await apiClient.post('/api/mobile/device', deviceInfo);
  return response.data;
};
```

### 3. App Version Check

```typescript
export const checkAppVersion = async () => {
  const response = await apiClient.get('/api/mobile/version', {
    params: {
      platform: Platform.OS,
      current_version: DeviceInfo.getVersion(),
    },
  });
  return response.data;
};
```

## RTK Query Integration

### API Slice Setup

```typescript
// src/store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAPIConfig } from '../../constants/api';
import { getTokens } from '../../utils/storage';

const baseQuery = fetchBaseQuery({
  baseUrl: getAPIConfig().baseURL,
  prepareHeaders: async (headers) => {
    const tokens = await getTokens();
    if (tokens?.accessToken) {
      headers.set('authorization', `Bearer ${tokens.accessToken}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Accounts', 'Transactions', 'Trades'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Get current user
    getCurrentUser: builder.query({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),

    // Accounts
    getAccounts: builder.query({
      query: () => '/api/accounts',
      providesTags: ['Accounts'],
    }),

    // Transactions
    getTransactions: builder.query({
      query: (filters) => ({
        url: '/api/transactions',
        params: filters,
      }),
      providesTags: ['Transactions'],
    }),

    createDeposit: builder.mutation({
      query: ({ accountId, amount }) => ({
        url: '/api/transactions/deposit',
        method: 'POST',
        body: { account_id: accountId, amount },
      }),
      invalidatesTags: ['Transactions', 'Accounts'],
    }),

    // Trades
    getTrades: builder.query({
      query: (filters) => ({
        url: '/api/trades',
        params: filters,
      }),
      providesTags: ['Trades'],
    }),

    createTrade: builder.mutation({
      query: (tradeData) => ({
        url: '/api/trades',
        method: 'POST',
        body: tradeData,
      }),
      invalidatesTags: ['Trades', 'Accounts'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useGetAccountsQuery,
  useGetTransactionsQuery,
  useCreateDepositMutation,
  useGetTradesQuery,
  useCreateTradeMutation,
} = apiSlice;
```

## File Upload Handling

### Document Picker Integration

```typescript
// src/utils/documentPicker.ts
import DocumentPicker from 'react-native-document-picker';

export interface DocumentFile {
  uri: string;
  type: string;
  name: string;
  size: number;
}

export const pickDocument = async (): Promise<DocumentFile | null> => {
  try {
    const result = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.pdf,
      ],
    });

    // Validate file size (5MB max)
    if (result[0].size && result[0].size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    return {
      uri: result[0].uri,
      type: result[0].type || 'application/octet-stream',
      name: result[0].name || 'document',
      size: result[0].size || 0,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return null;
    }
    throw error;
  }
};
```

### Image Picker Integration

```typescript
// src/utils/imagePicker.ts
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export const pickImageFromGallery = async (): Promise<DocumentFile | null> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 2000,
    maxHeight: 2000,
  });

  if (result.didCancel || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri!,
    type: asset.type || 'image/jpeg',
    name: asset.fileName || 'photo.jpg',
    size: asset.fileSize || 0,
  };
};

export const takePhoto = async (): Promise<DocumentFile | null> => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 2000,
    maxHeight: 2000,
  });

  if (result.didCancel || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri!,
    type: asset.type || 'image/jpeg',
    name: asset.fileName || 'photo.jpg',
    size: asset.fileSize || 0,
  };
};
```

## WebSocket Integration

### Socket.io Connection

```typescript
// src/services/websocket.ts
import io, { Socket } from 'socket.io-client';
import { getAPIConfig } from '../constants/api';
import { getTokens } from '../utils/storage';

class WebSocketService {
  private socket: Socket | null = null;

  async connect() {
    const tokens = await getTokens();
    const config = getAPIConfig();

    this.socket = io(config.wsURL, {
      auth: {
        token: tokens?.accessToken,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export default new WebSocketService();
```

### Usage in Components

```typescript
// Example: Real-time price updates
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import websocketService from '../services/websocket';
import { updateMarketPrice } from '../store/slices/tradingSlice';

const useMarketPrices = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    websocketService.connect();

    websocketService.on('price_update', (data) => {
      dispatch(updateMarketPrice(data));
    });

    return () => {
      websocketService.off('price_update');
      websocketService.disconnect();
    };
  }, [dispatch]);
};
```

## Error Handling

### Global Error Handler

```typescript
// src/utils/errorHandler.ts
export const handleAPIError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.detail ||
           error.response.data?.message ||
           'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your connection.';
  } else {
    // Error setting up request
    return error.message || 'An unexpected error occurred';
  }
};
```

### Usage in Components

```typescript
try {
  await createDeposit(accountId, amount);
} catch (error) {
  const message = handleAPIError(error);
  Alert.alert('Error', message);
}
```

## Offline Support

### Network State Detection

```typescript
// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};
```

### Queue Offline Requests

```typescript
// src/utils/offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'offline_request_queue';

export const queueRequest = async (request: any) => {
  const queue = await getQueue();
  queue.push(request);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const getQueue = async (): Promise<any[]> => {
  const queue = await AsyncStorage.getItem(QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
};

export const clearQueue = async () => {
  await AsyncStorage.removeItem(QUEUE_KEY);
};

export const processQueue = async () => {
  const queue = await getQueue();

  for (const request of queue) {
    try {
      await apiClient.request(request);
    } catch (error) {
      console.error('Failed to process queued request:', error);
    }
  }

  await clearQueue();
};
```

## Testing API Integration

### Mock API for Development

```typescript
// src/api/__mocks__/client.ts
export default {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};
```

### Integration Tests

```typescript
// __tests__/api/auth.test.ts
import { login, register } from '../../src/api/auth';
import apiClient from '../../src/api/client';

jest.mock('../../src/api/client');

describe('Auth API', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        access_token: 'token',
        refresh_token: 'refresh',
        user: { id: 1, email: 'test@test.com' },
      },
    };

    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await login('test@test.com', 'password');

    expect(result).toEqual(mockResponse.data);
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@test.com',
      password: 'password',
    });
  });
});
```

## Summary

The mobile app uses **100% of the same API** as the web application:
- ✅ All authentication endpoints
- ✅ All account management endpoints
- ✅ All transaction endpoints
- ✅ All trading endpoints
- ✅ Same error handling
- ✅ Same token management
- ✅ Same data formats

**Additional mobile-specific features:**
- Push notification token registration
- Device information tracking
- App version checking
- Offline request queueing
- WebSocket for real-time updates

This ensures complete feature parity between web and mobile platforms.
