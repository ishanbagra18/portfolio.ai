import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(({ className, label, id, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium opacity-80 pl-1 font-display">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={twMerge(
          clsx(
            "w-full px-4 py-3 bg-[var(--neo-bg)] neo-pressed outline-none transition-all duration-300",
            "focus:ring-2 focus:ring-accent-color/50 placeholder:opacity-40",
            error && "ring-2 ring-red-500/50",
            className
          )
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
