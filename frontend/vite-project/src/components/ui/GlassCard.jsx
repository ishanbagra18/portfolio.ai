import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ children, className, animate = true, ...props }) {
  const baseClasses = "glass-panel p-6 sm:p-8 flex flex-col relative overflow-hidden";
  
  if (!animate) {
    return (
      <div className={twMerge(clsx(baseClasses, className))} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={twMerge(clsx(baseClasses, className))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      {...props}
    >
      {/* Optional shine effect on glass card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
      {children}
    </motion.div>
  );
}
