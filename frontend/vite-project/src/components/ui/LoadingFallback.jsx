import React from 'react';
import { motion } from 'framer-motion';

export const LoadingFallback = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-aurora overflow-hidden relative">
      <div className="noise-overlay" />
      
      {/* Background Animated Blobs for aesthetic loading */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-l-4 border-violet-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--neo-text)]/80 font-display font-medium tracking-widest uppercase text-sm"
        >
          Loading Environment...
        </motion.div>
      </div>
    </div>
  );
};
