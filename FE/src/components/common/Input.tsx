"use client";

import { motion } from "framer-motion";
import { InputProps } from "@/types";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      required = false,
      className = "",
      name,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        className={`space-y-2 ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <motion.input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          }
          dark:text-white placeholder-gray-500 dark:placeholder-gray-400
        `}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        />
        {error && (
          <motion.p
            className="text-red-500 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  },
);

Input.displayName = "Input";

export default Input;
