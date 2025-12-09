import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Button Component
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} variant - Button style variant
 * @param {string} size - Button size
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Full width button
 * @param {string} className - Additional CSS classes
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-600',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-600',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white disabled:bg-slate-600',
    info: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-600',
    outline: 'border-2 border-slate-600 hover:border-slate-500 text-white disabled:border-slate-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'warning', 'info', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};
