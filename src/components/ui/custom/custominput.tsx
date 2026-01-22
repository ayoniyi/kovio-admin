/** @format */

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isPassword?: boolean;
  error?: string;
  onPasswordValid?: (isValid: boolean) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className = "",
      label,
      isPassword,
      type,
      error,
      onPasswordValid,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    // Base styles
    const baseStyles = `
      w-full h-12 px-4 py-2 text-sm
      bg-white border rounded-full
      transition-all duration-200 ease-in-out
      placeholder:text-gray-400
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      disabled:border-gray-200
    `;

    const getStateStyles = () => {
      if (error) {
        return `
          !border-red-500  text-red-900
          focus:!border-red-500 focus:!ring-2 focus:!ring-red-500/20
          focus:!outline-none focus:!ring-offset-0
        `;
      }

      if (isFocused) {
        return `
          !border-kv-primary !ring-2 !ring-kv-primary/20
          focus:!border-kv-primary focus:!ring-2 focus:!ring-kv-primary/20
          focus:!outline-none focus:!ring-offset-0
        `;
      }

      return `
        !border-gray-300
        hover:!border-gray-400
        focus:!border-kv-primary focus:!ring-2 focus:!ring-kv-primary/20
        focus:!outline-none focus:!ring-offset-0
      `;
    };

    const passwordButtonStyles = `
      absolute inset-y-0 right-3 
      flex items-center justify-center
      text-gray-400 hover:text-gray-600 
      focus:outline-none focus:text-gray-600
      transition-colors duration-150
      ${error ? "hover:text-red-500 focus:text-red-500" : ""}
    `;

    const labelStyles = `
      block text-sm font-medium mb-2
      ${error ? "text-red-700" : "text-gray-700"}
    `;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label className={labelStyles}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            className={`
              ${baseStyles}
              ${getStateStyles()}
              ${isPassword ? "pr-12" : "pr-4"}
              ${className}
            `
              .replace(/\s+/g, " ")
              .trim()}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className={passwordButtonStyles}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-start">
            <svg
              className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
