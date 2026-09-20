import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Target } from 'lucide-react';

export default function SpotlightOverlay({ spotlightId, onClose }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!spotlightId) {
      setRect(null);
      return;
    }

    const findAndHighlight = () => {
      const el = document.querySelector(`[data-assist-id="${spotlightId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const r = el.getBoundingClientRect();
          setRect({
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
            height: r.height,
            rawTop: r.top,
            rawLeft: r.left
          });
        }, 300);
      } else {
        setRect(null);
      }
    };

    findAndHighlight();
    window.addEventListener('resize', findAndHighlight);
    return () => window.removeEventListener('resize', findAndHighlight);
  }, [spotlightId]);

  if (!spotlightId || !rect) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
        {/* Semi-transparent dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Glowing Spotlight Box over target element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            top: `${rect.rawTop - 6}px`,
            left: `${rect.rawLeft - 6}px`,
            width: `${rect.width + 12}px`,
            height: `${rect.height + 12}px`
          }}
          className="fixed z-[10000] border-2 border-pink-500 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.8)] pointer-events-none animate-pulse"
        />

        {/* Callout Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            top: `${Math.max(20, rect.rawTop - 70)}px`,
            left: `${Math.max(20, Math.min(window.innerWidth - 320, rect.rawLeft))}px`
          }}
          className="fixed z-[10001] px-4 py-3 bg-zinc-900 border border-pink-500/40 text-white rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 max-w-xs"
        >
          <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
            <Target className="w-4 h-4 animate-spin" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-pink-300">Target Element Located!</p>
            <p className="text-zinc-400">Highlighted control on screen.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
