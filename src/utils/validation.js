/**
 * Validation utility functions
 */

/**
 * Validate amount is positive and greater than zero
 * @param {number} amount - Amount to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateAmount = (amount) => {
  if (!amount || amount <= 0) {
    return { isValid: false, error: 'Invalid amount. Must be greater than zero.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate balance is sufficient for transaction
 * @param {number} amount - Transaction amount
 * @param {number} balance - Current balance
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateBalance = (amount, balance) => {
  if (amount > balance) {
    return { isValid: false, error: 'Insufficient balance.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate leverage value
 * @param {number} leverage - Leverage value
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateLeverage = (leverage) => {
  if (leverage < 1 || leverage > 1000) {
    return { isValid: false, error: 'Leverage must be between 1 and 1000.' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate required fields
 * @param {object} fields - Object with field values
 * @param {array} requiredFields - Array of required field names
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateRequiredFields = (fields, requiredFields) => {
  for (const field of requiredFields) {
    if (!fields[field] || fields[field] === '') {
      return { isValid: false, error: `${field} is required.` };
    }
  }
  return { isValid: true, error: null };
};
