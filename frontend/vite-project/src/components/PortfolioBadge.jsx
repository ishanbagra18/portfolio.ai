import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PortfolioBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/80 hover:bg-black border border-white/20 text-white shadow-2xl backdrop-blur-xl text-xs font-sans font-semibold transition-all hover:scale-105 hover:border-pink-500/50"
      >
        <span className="w-5 h-5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
          ⚡
        </span>
        <span className="text-white/80 group-hover:text-white transition">
          Built with <strong className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 font-extrabold">Portfolio.io</strong>
        </span>
        <Sparkles className="w-3.5 h-3.5 text-pink-400 opacity-70 group-hover:opacity-100 transition" />
      </a>
    </div>
  );
}
