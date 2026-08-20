import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  className, 
  variant = 'neo', 
  type = 'button',
  magnetic = true,
  ...props 
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!magnetic) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    if (!magnetic) return;
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative inline-flex items-center justify-center px-6 py-3 font-display font-medium text-sm transition-colors duration-300 rounded-full outline-none focus:ring-2 focus:ring-accent-color/50 focus:ring-offset-2 focus:ring-offset-[var(--neo-bg)]";
  
  const variants = {
    neo: "neo-surface hover:text-accent-color active:neo-pressed active:text-current",
    glass: "glass-panel hover:bg-[var(--neo-bg)]/30 active:bg-[var(--neo-bg)]/40",
    primary: "bg-accent-color text-[var(--neo-text)] shadow-lg shadow-accent-color/30 hover:bg-indigo-600 active:scale-95",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={twMerge(clsx(baseClasses, variants[variant], className))}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
