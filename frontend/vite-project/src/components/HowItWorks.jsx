import React from 'react';
import { GlassCard } from './ui/GlassCard';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Import Profile Data',
      description: 'Fill in your personal bio, work experience, tech stack, and social links manually or import them directly using your account profile.'
    },
    {
      number: '02',
      title: 'Select a Template',
      description: 'Browse our curated collection of sleek, modern themes. Toggle minimalist aesthetics, dark modes, and layout grids with a single click.'
    },
    {
      number: '03',
      title: 'Publish & Share',
      description: 'Hit deploy to launch your personalized portfolio live to the world. Share your sleek URL with recruiters, clients, and peers.'
    }
  ];

  return (
    <section className="py-24 z-10 relative px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs font-bold text-accent-color uppercase tracking-widest block mb-2">Process</span>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
              Live In 3 Simple Steps
            </h2>
          </div>
          <p className="opacity-60 text-sm mt-4 md:mt-0 max-w-xs font-medium">
            No design degrees or server setup required. Get from zero to deployed in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Decorative connector line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <GlassCard key={index} className="relative z-10 p-8 group hover:-translate-y-2 transition-transform duration-300 text-center md:text-left">
              <span 
                className="text-6xl font-display font-black tracking-tighter block mb-6 opacity-20 group-hover:opacity-100 group-hover:text-accent-color transition-all duration-300"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent' }}
              >
                {step.number}
              </span>
              <h3 className="text-xl font-display font-bold uppercase tracking-wider mb-3 text-[var(--neo-text)]">
                {step.title}
              </h3>
              <p className="opacity-70 text-sm leading-relaxed">
                {step.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;