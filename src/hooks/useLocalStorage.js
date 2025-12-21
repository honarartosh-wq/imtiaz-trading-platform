import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with state sync
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Failed to read from localStorage, return initial value
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Failed to write to localStorage, state still updated
    }
  };

  // Remove from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      // Failed to remove from localStorage, still reset state
    }
  };

  return [storedValue, setValue, removeValue];
};
