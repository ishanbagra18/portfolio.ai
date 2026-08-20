import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 z-10 relative px-6">
      <GlassCard className="max-w-5xl mx-auto p-12 md:p-20 text-center relative overflow-hidden border-accent-color/20">
        {/* Animated abstract shapes for visual flair */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-6 uppercase">
            Ready To Upgrade Your Online Presence?
          </h2>
          <p className="opacity-80 text-sm md:text-lg mb-10 leading-relaxed font-medium">
            Join thousands of developers and designers who trust Portfolio.io to land their dream jobs and client contracts.
          </p>
          <Button 
            onClick={() => navigate('/viewtemplates')}
            variant="primary"
            className="text-sm px-10 py-5  hover:bg-pink-500/20"
          >
            Get Started For Free
          </Button>
        </div>
      </GlassCard>
    </section>
  );
};

export default CallToAction;