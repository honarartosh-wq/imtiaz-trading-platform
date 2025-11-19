// Trading symbols supported by the platform
export const TRADING_SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];

// Default extra spread values for each symbol
export const DEFAULT_EXTRA_SPREAD = {
  EURUSD: 0.5,
  GBPUSD: 0.5,
  USDJPY: 0.5,
  XAUUSD: 2.0,
  BTCUSD: 10.0
};

// Order types
export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
  STOP: 'STOP'
};

// Position types
export const POSITION_TYPES = {
  BUY: 'BUY',
  SELL: 'SELL'
};

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  TRANSFER: 'transfer',
  TRADE_PROFIT: 'trade_profit',
  TRADE_LOSS: 'trade_loss',
  COMMISSION: 'commission'
};

// Account types
export const ACCOUNT_TYPES = {
  STANDARD: 'standard',
  BUSINESS: 'business'
};

// User types/roles
export const USER_ROLES = {
  MANAGER: 'manager',
  ADMIN: 'admin',
  CLIENT: 'client'
};

// LP (Liquidity Provider) types
export const LP_TYPES = {
  MT5: 'MT5',
  FIX: 'FIX'
};
