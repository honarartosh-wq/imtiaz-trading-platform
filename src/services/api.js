import axios from 'axios';

// API base URL - defaults to localhost:8000 for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ==================== SECURITY WARNING ====================
// IMPORTANT: This implementation uses localStorage for token storage.
// This is acceptable for development but has security limitations:
//
// 1. Vulnerable to XSS attacks - malicious scripts can access localStorage
// 2. Tokens are accessible via JavaScript
//
// PRODUCTION RECOMMENDATIONS:
// - Use httpOnly cookies for token storage (preferred)
// - Implement Content Security Policy (CSP) headers
// - Use Secure and SameSite cookie flags
// - Consider using a secure backend session management
//
// TODO: Migrate to httpOnly cookies before production deployment
// ==========================================================

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Try to refresh the access token
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================== Authentication APIs ====================

/**
 * Register a new user with KYC documents
 * @param {FormData|Object} userData - User registration data (FormData for KYC uploads or Object for simple registration)
 * @returns {Promise} User response with tokens
 */
export const register = async (userData) => {
  // Check if userData is FormData (for KYC document uploads)
  const isFormData = userData instanceof FormData;

  // If it's FormData, send as-is with multipart/form-data
  // Otherwise, convert to the expected format
  const config = isFormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } : {};

  const payload = isFormData ? userData : {
    email: userData.email,
    password: userData.password,
    name: userData.name,
    phone: userData.phone || null,
    referral_code: userData.referralCode,
    account_type: userData.accountType || 'standard',
  };

  const response = await api.post('/api/auth/register', payload, config);
  return response.data;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Tokens and user data
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

/**
 * Get current user information
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} New access token
 */
export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post('/api/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data;
};

/**
 * Logout user (client-side)
 * Note: Clears tokens from localStorage
 * In production with httpOnly cookies, this should call a backend logout endpoint
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// ==================== Account APIs ====================

/**
 * Get user accounts
 * @returns {Promise} Array of user accounts
 */
export const getAccounts = async () => {
  const response = await api.get('/api/accounts');
  return response.data;
};

/**
 * Get account by ID
 * @param {number} accountId - Account ID
 * @returns {Promise} Account data
 */
export const getAccountById = async (accountId) => {
  const response = await api.get(`/api/accounts/${accountId}`);
  return response.data;
};

/**
 * Create a new account
 * @param {Object} accountData - Account creation data
 * @returns {Promise} Created account
 */
export const createAccount = async (accountData) => {
  const response = await api.post('/api/accounts', accountData);
  return response.data;
};

/**
 * Update account
 * @param {number} accountId - Account ID
 * @param {Object} updateData - Update data
 * @returns {Promise} Updated account
 */
export const updateAccount = async (accountId, updateData) => {
  const response = await api.put(`/api/accounts/${accountId}`, updateData);
  return response.data;
};

// ==================== Transaction APIs ====================

/**
 * Get user transactions
 * @param {Object} filters - Filter parameters (limit, offset, type)
 * @returns {Promise} Array of transactions
 */
export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/api/transactions?${params}`);
  return response.data;
};

/**
 * Create a deposit transaction
 * @param {number} accountId - Account ID
 * @param {number} amount - Deposit amount
 * @returns {Promise} Transaction response
 */
export const createDeposit = async (accountId, amount) => {
  const response = await api.post('/api/transactions/deposit', {
    account_id: accountId,
    amount,
  });
  return response.data;
};

/**
 * Create a withdrawal transaction
 * @param {number} accountId - Account ID
 * @param {number} amount - Withdrawal amount
 * @returns {Promise} Transaction response
 */
export const createWithdrawal = async (accountId, amount) => {
  const response = await api.post('/api/transactions/withdraw', {
    account_id: accountId,
    amount,
  });
  return response.data;
};

/**
 * Create a transfer transaction
 * @param {number} accountId - Source account ID
 * @param {string} toEmail - Recipient email
 * @param {number} amount - Transfer amount
 * @param {string} description - Transfer description
 * @returns {Promise} Transaction response
 */
export const createTransfer = async (accountId, toEmail, amount, description = '') => {
  const response = await api.post('/api/transactions/transfer', {
    account_id: accountId,
    to_email: toEmail,
    amount,
    description,
  });
  return response.data;
};

// ==================== Trade APIs ====================

/**
 * Get user trades
 * @param {Object} filters - Filter parameters (limit, offset, status)
 * @returns {Promise} Array of trades
 */
export const getTrades = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/api/trades?${params}`);
  return response.data;
};

/**
 * Create a new trade
 * @param {Object} tradeData - Trade data
 * @returns {Promise} Created trade
 */
export const createTrade = async (tradeData) => {
  const response = await api.post('/api/trades', tradeData);
  return response.data;
};

/**
 * Close a trade
 * @param {number} tradeId - Trade ID
 * @param {number} closePrice - Closing price
 * @returns {Promise} Updated trade
 */
export const closeTrade = async (tradeId, closePrice) => {
  const response = await api.post(`/api/trades/${tradeId}/close`, {
    close_price: closePrice,
  });
  return response.data;
};

// ==================== Branch APIs ====================

/**
 * Get all branches
 * @returns {Promise} Array of branches
 */
export const getBranches = async () => {
  const response = await api.get('/api/branches');
  return response.data;
};

/**
 * Validate referral code
 * @param {string} referralCode - Referral code to validate
 * @returns {Promise} Branch data if valid
 */
export const validateReferralCode = async (referralCode) => {
  const response = await api.get(`/api/branches/validate/${referralCode}`);
  return response.data;
};

// ==================== User APIs ====================

/**
 * Get all users (Admin only)
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Array of users
 */
export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/api/users?${params}`);
  return response.data;
};

/**
 * Update user
 * @param {number} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise} Updated user
 */
export const updateUser = async (userId, updateData) => {
  const response = await api.put(`/api/users/${userId}`, updateData);
  return response.data;
};

// ==================== Error Handler ====================

/**
 * Extract error message from API error
 * @param {Error} error - Axios error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.detail || error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your connection.';
  } else {
    // Error setting up request
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
