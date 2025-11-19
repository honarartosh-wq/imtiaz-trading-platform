import React from 'react';

/**
 * Spinner loading component
 * @param {object} props - Component props
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} props.color - Spinner color (default: 'emerald')
 */
const Spinner = ({ size = 'md', color = 'emerald' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    emerald: 'border-emerald-600 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-600 border-t-transparent'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
};

export default Spinner;
