import React from 'react';
import { GlassCard } from './ui/GlassCard';

const FeatureGrid = () => {
  const features = [
    {
      title: 'AI-Powered Generation',
      description: 'Our engine analyzes your GitHub and resume to automatically generate optimal layouts and highlight your best work.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      )
    },
    {
      title: 'Production-Ready Code',
      description: 'Clean, accessible, and ultra-fast code out of the box. Optimized for SEO and top-tier Lighthouse scores.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      )
    },
    {
      title: 'One-Click Deployment',
      description: 'Connect your custom domain or deploy instantly to our global CDN edge network with automatic SSL included.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 z-10 relative px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">
          Everything You Need
        </h2>
        <p className="opacity-70 text-sm md:text-base mb-16 max-w-xl font-medium">
          Designed specifically for developers and designers who want to showcase their skills without getting bogged down in boilerplate code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <GlassCard 
              key={index}
              className="p-8 group hover:border-accent-color/50 transition duration-300 relative overflow-hidden"
            >
              {/* Add a subtle glow behind the icon */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-color/5 rounded-full blur-2xl group-hover:bg-accent-color/20 transition duration-500 pointer-events-none"></div>

              <div className="w-12 h-12 rounded-xl bg-accent-color/10 border border-accent-color/20 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 text-accent-color">
                {item.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-3 tracking-wide group-hover:text-[var(--neo-text)] transition-colors">{item.title}</h3>
              <p className="opacity-70 text-sm leading-relaxed">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;