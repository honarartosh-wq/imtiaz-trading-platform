/**
 * Helper utility functions
 */

/**
 * Generate a random account number
 * NOTE: This uses Math.random() for demo purposes only.
 * In production, use a secure backend-generated ID.
 * @returns {string} Account number in format ACC-XXXXX
 */
export const generateAccountNumber = () => {
  return `ACC-${Math.floor(10000 + Math.random() * 90000)}`;
};

/**
 * Generate a unique ID using timestamp
 * NOTE: This is NOT cryptographically secure and should only be used for demo purposes.
 * In production, use UUID library or backend-generated IDs.
 * @returns {number} Timestamp-based ID
 */
export const generateId = () => {
  return Date.now();
};

/**
 * Format currency value
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value == null || isNaN(value)) {
    return '0.00';
  }
  return Number(value).toFixed(decimals);
};

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

/**
 * Calculate total from array of transactions
 * @param {array} transactions - Array of transaction objects
 * @param {string} type - Transaction type to filter by
 * @returns {number} Total amount
 */
export const calculateTransactionTotal = (transactions, type) => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Get decimal places for a trading symbol
 * @param {string} symbol - Trading symbol
 * @returns {number} Number of decimal places
 */
export const getSymbolDecimals = (symbol) => {
  return (symbol === 'XAUUSD' || symbol === 'BTCUSD') ? 2 : 5;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Safe parse float with fallback
 * @param {string|number} value - Value to parse
 * @param {number} fallback - Fallback value if parse fails
 * @returns {number} Parsed float or fallback
 */
export const safeParseFloat = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Safe parse int with fallback
 * @param {string|number} value - Value to parse
 * @param {number} fallback - Fallback value if parse fails
 * @returns {number} Parsed int or fallback
 */
export const safeParseInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};
