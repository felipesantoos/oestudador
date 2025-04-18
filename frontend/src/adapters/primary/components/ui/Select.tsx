import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className = '',
    label,
    helperText,
    error,
    id,
    fullWidth = false,
    options,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <select
          className={`
            px-4 py-2 border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-500' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          id={selectId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={`${selectId}-help ${selectId}-error`}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {helperText && !error && (
          <p 
            id={`${selectId}-help`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={`${selectId}-error`}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 