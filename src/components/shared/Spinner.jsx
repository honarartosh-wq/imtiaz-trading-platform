import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Spinner Component
 * @param {string} size - Spinner size (sm, md, lg)
 * @param {string} color - Spinner color
 */
export function Spinner({ size = 'md', color = 'emerald' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    emerald: 'border-emerald-600 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['emerald', 'blue', 'white']),
};
