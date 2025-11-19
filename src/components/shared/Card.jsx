import React from 'react';

/**
 * Reusable Card component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title (optional)
 * @param {React.ReactNode} props.header - Custom header content (optional)
 * @param {React.ReactNode} props.footer - Footer content (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Whether to show hover effect
 */
const Card = ({
  children,
  title,
  header,
  footer,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-xl ${
        hover ? 'hover:border-slate-600 transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {(title || header) && (
        <div className="border-b border-slate-700 p-6">
          {header || <h3 className="text-xl font-bold text-white">{title}</h3>}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-700 p-6">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
