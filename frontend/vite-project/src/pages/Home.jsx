import React, { useLayoutEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import CallToAction from '../components/CallToAction';
import HowItWorks from '../components/HowItWorks';
import FeatureGrid from '../components/FeatureGrid';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { ParallaxScroll, ParallaxTilt, ParallaxBackground } from '../components/ui/Parallax';

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".hero-line", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      })
      .from(".hero-subtext", {
        opacity: 0,
        y: 20,
        duration: 0.6,
      }, "-=0.4")
      .from(".hero-btn", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.2")
      .from(".hero-image", {
        opacity: 0,
        x: 40,
        scale: 0.9,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");
      
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between relative overflow-x-hidden font-sans"
    >
      <div className="noise-overlay" />
      <ParallaxBackground />

      <Navbar />

      <div className="z-10 max-w-6xl mx-auto px-6 pt-12 pb-24 w-full flex-grow flex flex-col justify-center relative" ref={heroRef}>
        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[1.05] mb-8 select-none ">
            <div className="hero-line overflow-hidden">
              <span className="inline-block pb-2">Build Portfolios</span>
            </div>
            <div className="hero-line overflow-hidden">
              <span className="inline-block bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent pb-2">That Stand Out</span>
            </div>
            <div className="hero-line overflow-hidden">
              <span className="inline-block pb-2">From The Crowd</span>
            </div>
          </h1>

          <p className="hero-subtext text-[var(--neo-text)] opacity-80 text-lg md:text-xl max-w-md leading-relaxed mb-10 tracking-wide font-medium">
            AI-powered layouts. Production-ready designs. <br />
            Deploy your professional portfolio in less than 5 minutes.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" onClick={() => navigate('/viewtemplates')} className="hero-btn group hover:bg-pink-400">
              Create Portfolio 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Button>

            <Button 
              variant="neo"
              onClick={() => navigate('/viewtemplates')}
              className="hero-btn"
            >
              Explore Templates
            </Button>
          </div>
        </div>

        {/* 3D Image on the Right with Parallax Scroll & Tilt */}
        <div className="hidden lg:block absolute right-0 top-12 xl:top-4 z-0 hero-image pointer-events-auto">
          <ParallaxScroll speed={-0.15}>
            <ParallaxTilt maxDegree={15} maxTranslateZ={30}>
              <img 
                src="https://i.pinimg.com/736x/56/e7/35/56e73531c55a935b70a3d9ae5a802002.jpg" 
                alt="3D element" 
                className="w-[280px] xl:w-[350px] object-contain rounded-[2rem] opacity-90 mix-blend-screen shadow-[0_0_100px_rgba(139,92,246,0.3)] transition-transform duration-300"
              />
            </ParallaxTilt>
          </ParallaxScroll>
        </div>
        
        {/* Bento Grid with 3D Parallax Tilt */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <ParallaxTilt className="md:col-span-2 md:row-span-2">
            <GlassCard className="h-full min-h-[380px] flex justify-end flex-col group hover:border-white/40 transition-colors relative overflow-hidden">
              {/* Mock UI Visual */}
              <div className="absolute top-6 left-6 right-6 bottom-32 bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 p-6 flex flex-col gap-3 overflow-hidden group-hover:bg-white/10 transition-colors duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-3.5 h-3.5 text-accent-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-[var(--neo-text)]/60 font-mono text-[10px] font-bold uppercase tracking-widest">AI Setup</span>
                </div>
                <div className="text-[var(--neo-text)] font-bold text-base">Optimal layout generated.</div>
                <div className="text-[var(--neo-text)]/50 text-xs leading-relaxed max-w-[90%]">Portfolio structure customized based on your recent GitHub activity and resume data.</div>
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="font-bold text-[var(--neo-text)] text-sm">98%</span>
                    <span className="text-[9px] text-[var(--neo-text)]/40 uppercase tracking-widest mt-0.5 font-mono">Match</span>
                  </div>
                  <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="font-bold text-[var(--neo-text)] text-sm">Dark</span>
                    <span className="text-[9px] text-[var(--neo-text)]/40 uppercase tracking-widest mt-0.5 font-mono">Theme</span>
                  </div>
                  <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                    <span className="font-bold text-[var(--neo-text)] text-sm">Bento</span>
                    <span className="text-[9px] text-[var(--neo-text)]/40 uppercase tracking-widest mt-0.5 font-mono">Grid</span>
                  </div>
                </div>
              </div>
              
              <div className="relative mt-auto pt-8">
                <h3 className="text-3xl font-display font-bold">Intelligent Layouts</h3>
                <p className="opacity-80 mt-2 text-lg">Our AI analyzes your data to pick the best presentation format automatically.</p>
              </div>
            </GlassCard>
          </ParallaxTilt>
          
          <ParallaxTilt>
            <GlassCard className="h-full min-h-[150px] group hover:border-white/40 transition-colors">
               <h3 className="text-xl font-display font-bold">Lightning Fast</h3>
               <p className="text-sm opacity-80 mt-2">Deployed globally on edge networks for instant load times.</p>
            </GlassCard>
          </ParallaxTilt>

          <ParallaxTilt>
            <GlassCard className="h-full min-h-[150px] bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/20 group hover:border-violet-500/40 transition-colors">
               <h3 className="text-xl font-display font-bold text-accent-color">Custom Domains</h3>
               <p className="text-sm opacity-80 mt-2">Connect your own domain with one simple click.</p>
            </GlassCard>
          </ParallaxTilt>
        </div>
      </div>

      <div className="z-10 w-full">
        <ParallaxScroll speed={0.1}>
          <FeatureGrid />
        </ParallaxScroll>
        <ParallaxScroll speed={-0.1}>
          <HowItWorks />
        </ParallaxScroll>
        <CallToAction />
      </div>

      <footer className="z-10 text-xs font-medium opacity-60 flex flex-col sm:flex-row justify-between items-center w-full border-t border-[var(--neo-shadow-dark)]/20 p-8 mt-12 backdrop-blur-sm">
        <p>© 2026 Portfolio.io. All rights reserved.</p>
        <p>Crafted for Developers & Designers</p>
      </footer>
    </motion.div>
  );
};

export default Home;