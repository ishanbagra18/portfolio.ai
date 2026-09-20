import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import CallToAction from '../components/CallToAction';
import HowItWorks from '../components/HowItWorks';
import FeatureGrid from '../components/FeatureGrid';
import HeroDemoSequence from '../components/HeroDemoSequence';
import PricingTable from '../components/PricingTable';
import FaqAccordion from '../components/FaqAccordion';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { ParallaxScroll, ParallaxTilt, ParallaxBackground, ParallaxMouseItem } from '../components/ui/Parallax';
import { X, Minus, Maximize2, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const ROLE_DEMOS = [
  {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    accent: 'from-indigo-500 via-purple-500 to-indigo-600',
    activeClass: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white border-indigo-400/80 shadow-lg shadow-indigo-500/35 ring-1 ring-indigo-400/50',
    color: '#6366f1',
    atsScore: '99.2%',
    layout: 'Bento Grid + Live Projects',
    template: 'Template 1 (Modern Minimalist)',
    techs: ['React 19', 'Node.js', 'TypeScript', 'Supabase', 'Tailwind'],
    previewImg: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ai',
    title: 'AI / ML Engineer',
    accent: 'from-cyan-400 via-teal-400 to-blue-500',
    activeClass: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white border-cyan-400/80 shadow-lg shadow-cyan-500/35 ring-1 ring-cyan-400/50',
    color: '#06b6d4',
    atsScore: '98.7%',
    layout: 'Terminal Cyberpunk + Case Studies',
    template: 'Template 12 (AI Cyberpunk)',
    techs: ['Python', 'PyTorch', 'Gemini AI', 'FastAPI', 'Docker'],
    previewImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'designer',
    title: 'UI/UX Designer',
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    activeClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-amber-300/80 shadow-lg shadow-amber-500/35 ring-1 ring-amber-400/50',
    color: '#f59e0b',
    atsScore: '97.9%',
    layout: 'Glassmorphism Gallery + Figma Embeds',
    template: 'Template 4 (Neon Glass)',
    techs: ['Figma', 'Prototyping', 'Design Systems', 'CSS3', 'Framer'],
    previewImg: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mobile',
    title: 'Mobile Engineer',
    accent: 'from-emerald-400 via-teal-400 to-emerald-600',
    activeClass: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white border-emerald-400/80 shadow-lg shadow-emerald-500/35 ring-1 ring-emerald-400/50',
    color: '#10b981',
    atsScore: '98.5%',
    layout: 'App Store Grid + Metric Cards',
    template: 'Template 8 (Clean Executive)',
    techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    previewImg: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
  }
];

/* ---------------- Interactive Hero Window Control Mockup ---------------- */
const HeroWindowMockup = ({ activeRole, navigate }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  if (isClosed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative rounded-3xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-xl p-6 text-center shadow-2xl flex flex-col items-center justify-center min-h-[280px]"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3">
          <X className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Preview Window Closed</h4>
        <p className="text-xs text-white/60 mb-5 max-w-xs">You clicked the red close button. Click restore to open the live preview again.</p>
        <button
          onClick={() => setIsClosed(false)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:opacity-90 transition flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restore Preview
        </button>
      </motion.div>
    );
  }

  // Expanded layout rendered in the same place
  if (isMaximized) {
    return (
      <motion.div
        key="maximized-view"
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative z-10 w-full glass-panel bg-zinc-950/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Ambient background aura */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-40 pointer-events-none"
          style={{ background: activeRole.color }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-30 pointer-events-none"
          style={{ background: '#ec4899' }}
        />

        {/* Modal Top Control Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-md shrink-0 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMaximized(false)}
                title="Close Fullscreen Preview"
                className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-rose-950 font-bold transition hover:scale-110 cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => setIsMaximized(false)}
                title="Minimize Modal"
                className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 transition hover:scale-110 cursor-pointer"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/50 shrink-0" />
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />
            {/* Truncated Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-white/60 min-w-0">
              <span className="text-white/90 font-medium truncate">{activeRole.title} Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pl-2">
            <span className="px-2 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-[9px] sm:text-[10px] font-mono font-bold text-pink-300 uppercase tracking-wider truncate max-w-[100px] sm:max-w-[150px]">
              {activeRole.template}
            </span>
            <button
              onClick={() => setIsMaximized(false)}
              className="p-1 sm:p-1.5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-medium"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          {/* Main Hero Showcase Frame */}
          <div className="relative rounded-2xl border border-white/15 bg-black/60 overflow-hidden shadow-2xl group">
            {/* Simulated Desktop Browser Frame Bar */}
            <div className="bg-zinc-900/90 border-b border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between text-xs text-white/50 font-mono">
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/20" />
              </div>
              <div className="px-2 py-1 sm:px-4 rounded-lg bg-black/60 border border-white/10 text-[10px] sm:text-[11px] text-white/70 max-w-[150px] sm:max-w-md truncate text-center font-mono mx-2">
                portfolio.io/demo/{activeRole.id}
              </div>
              <div className="text-[9px] sm:text-[10px] text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Visual Portfolio Banner & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
              {/* Image & Overlay Column */}
              <div className="lg:col-span-7 relative min-h-[220px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                <img
                  src={activeRole.previewImg}
                  alt={activeRole.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-5 sm:p-6 flex flex-col justify-end">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] sm:text-xs font-mono text-pink-300 backdrop-blur-md w-fit mb-2">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400" />
                    Ultra HD Render
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                    {activeRole.title}
                  </h3>
                </div>
              </div>

              {/* Stats & Specification Column */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-zinc-900/60 backdrop-blur-md space-y-5">
                <div>
                  <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-pink-400 font-bold mb-3">
                    Performance Specs
                  </h4>
                  {/* Fixed overlapping stats block */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase truncate">ATS Score</div>
                      <div className="text-base sm:text-lg font-black text-pink-400 mt-0.5 truncate">{activeRole.atsScore}</div>
                    </div>
                    <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      <div className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase truncate">Speed Index</div>
                      <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5 truncate">99/100</div>
                    </div>
                  </div>

                  <h4 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/50 font-bold mb-2">
                    Tech Stack Included
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRole.techs.map((t, idx) => (
                      <span key={idx} className="px-2 py-1 sm:px-2.5 rounded-lg bg-white/10 border border-white/15 text-[10px] sm:text-xs font-medium text-white/90">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feature Highlights - Streamlined Text */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-start gap-2 text-[11px] sm:text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">Instant AI Resume & Bio Parsing</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] sm:text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">Recruiter Chatbot & Lead Forms</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] sm:text-xs text-white/80">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">Custom Domain & SSL Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-white/10">
            <div className="text-[11px] sm:text-xs text-white/60 text-center sm:text-left leading-tight">
              Customize this theme and start building in under 3 minutes.
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsMaximized(false)}
                className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-[11px] sm:text-xs transition cursor-pointer text-center"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsMaximized(false);
                  navigate('/viewtemplates');
                }}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-[11px] sm:text-xs shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard minimized/initial view
  return (
    <motion.div
      key={activeRole.id}
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative rounded-3xl border border-zinc-200 dark:border-white/15 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl p-6 shadow-2xl overflow-hidden group text-zinc-900 dark:text-white"
    >
      {/* Glowing corner glow */}
      <div
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-50 transition-colors duration-500"
        style={{ background: activeRole.color }}
      />

      {/* Widget Top Bar Controls */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2">
          {/* Red (Close / Cross) */}
          <button
            onClick={() => setIsClosed(true)}
            title="Close Window (Cross)"
            className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-rose-950 opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md group/btn cursor-pointer"
          >
            <X className="w-2.5 h-2.5 opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold stroke-[3]" />
          </button>

          {/* Yellow (Minimize) */}
          <button
            onClick={() => setIsMinimized(prev => !prev)}
            title={isMinimized ? "Restore Window Size" : "Minimize Window"}
            className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-amber-950 opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md group/btn cursor-pointer"
          >
            <Minus className="w-2.5 h-2.5 opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold stroke-[3]" />
          </button>

          {/* Green (Maximize / Expand) */}
          <button
            onClick={() => setIsMaximized(true)}
            title="Maximize Fullscreen Preview"
            className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-emerald-950 opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md group/btn cursor-pointer"
          >
            <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover/btn:opacity-100 transition-opacity font-bold stroke-[3]" />
          </button>
        </div>

        <div className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-mono text-pink-600 dark:text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1.5 max-w-[150px] sm:max-w-none truncate">
          {isMinimized && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />}
          <span className="truncate">{activeRole.template}</span> {isMinimized ? '(Min)' : ''}
        </div>
      </div>

      {/* Collapsible Content Body when Minimized */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Live Preview Card Content */}
            <div className="relative rounded-2xl overflow-hidden mb-5 border border-zinc-200 dark:border-white/10 bg-zinc-900 dark:bg-black/40 h-44 group-hover:scale-[1.01] transition-transform duration-500">
              <img
                src={activeRole.previewImg}
                alt={activeRole.title}
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                <div className="text-xs font-mono text-pink-400 font-bold uppercase mb-0.5">Live Mockup</div>
                <h4 className="text-lg font-bold text-white tracking-wide">{activeRole.title} Portfolio</h4>
              </div>
            </div>

            {/* Live AI Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
              <div className="bg-zinc-100 dark:bg-white/5 p-2 sm:p-3 rounded-xl border border-zinc-200 dark:border-white/5 text-center overflow-hidden">
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 dark:text-white/50 uppercase tracking-widest truncate">ATS Match</div>
                <div className="text-sm sm:text-base font-extrabold text-pink-600 dark:text-pink-400 mt-0.5 truncate">{activeRole.atsScore}</div>
              </div>
              <div className="bg-zinc-100 dark:bg-white/5 p-2 sm:p-3 rounded-xl border border-zinc-200 dark:border-white/5 text-center overflow-hidden">
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 dark:text-white/50 uppercase tracking-widest truncate">Speed</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">99 / 100</div>
              </div>
              <div className="bg-zinc-100 dark:bg-white/5 p-2 sm:p-3 rounded-xl border border-zinc-200 dark:border-white/5 text-center overflow-hidden">
                <div className="text-[9px] sm:text-[10px] font-mono text-zinc-500 dark:text-white/50 uppercase tracking-widest truncate">SSL</div>
                <div className="text-sm sm:text-base font-extrabold text-violet-600 dark:text-violet-400 mt-0.5 truncate">Auto</div>
              </div>
            </div>

            {/* Tech Pills */}
            <div className="flex flex-wrap gap-1.5">
              {activeRole.techs.map((t, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] sm:text-[11px] font-medium text-zinc-700 dark:text-white/80">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [activeRole, setActiveRole] = useState(ROLE_DEMOS[0]);
  const [comparisonTab, setComparisonTab] = useState('after');

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
        }, "-=0.2");

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

      {/* Hero Section */}
      <div className="z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 w-full flex-grow flex flex-col justify-center relative" ref={heroRef}>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 pt-4">

          {/* Left Hero Text Column */}
          <div className="lg:col-span-7">
            <ParallaxScroll speed={-0.06}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-md mb-6 text-xs font-semibold text-pink-600 dark:text-pink-400">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                The #1 Portfolio Generator for Tech Talent
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-display font-black tracking-tighter leading-[1.05] mb-6 select-none">
                <div className="hero-line overflow-hidden">
                  <span className="inline-block pb-1">Build Portfolios</span>
                </div>
                <div className="hero-line overflow-hidden">
                  <span className="inline-block bg-gradient-to-r from-violet-500 via-pink-500 to-purple-500 bg-clip-text text-transparent pb-1">That Stand Out</span>
                </div>
                <div className="hero-line overflow-hidden">
                  <span className="inline-block pb-1">From The Crowd</span>
                </div>
              </h1>
            </ParallaxScroll>

            <ParallaxScroll speed={-0.03}>
              <p className="hero-subtext text-[var(--neo-text)] opacity-80 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed mb-8 font-medium">
                Transform raw resume data & GitHub repos into stunning, production-grade interactive portfolio sites in under 3 minutes.
              </p>
            </ParallaxScroll>

            {/* Interactive Role Switcher Chips */}
            <div className="mb-8">
              <div className="text-xs font-mono font-bold text-[var(--neo-text)]/50 uppercase tracking-widest mb-3">
                ⚡ Select your role to preview live AI setup:
              </div>
              <div className="flex flex-wrap gap-2">
                {ROLE_DEMOS.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                      activeRole.id === role.id
                        ? `${role.activeClass} scale-105`
                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-white/70 border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/15 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <Button
                variant="primary"
                onClick={() => navigate('/viewtemplates')}
                className="hero-btn group hover:bg-pink-400 bg-gradient-to-r from-pink-500 via-purple-600 shadow-xl shadow-pink-500/25 px-7 py-3.5 text-base font-bold"
              >
                Build My Portfolio Free
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Button>

              <Button
                variant="neo"
                onClick={() => navigate('/ats-checker')}
                className="hero-btn px-6 py-3.5 text-sm"
              >
                Scan Resume ATS Score
              </Button>
            </div>
          </div>

          {/* Right Interactive Live AI Preview Widget */}
          <div className="lg:col-span-5 relative">
            <ParallaxMouseItem factor={30}>
              <ParallaxTilt maxDegree={14} maxTranslateZ={35}>
                <AnimatePresence mode="wait">
                  <HeroWindowMockup activeRole={activeRole} navigate={navigate} />
                </AnimatePresence>
              </ParallaxTilt>
            </ParallaxMouseItem>
          </div>
        </div>

        {/* Animated Hero Product Demo (Resume Drop -> AI Extraction -> Live Site Assembly) */}
        <div className="mt-24 z-10 max-w-5xl mx-auto">
          <ParallaxScroll speed={0.05}>
            <HeroDemoSequence />
          </ParallaxScroll>
        </div>

        {/* Live Interactive Stats Banner */}
        <div className="mt-20 z-10">
          <ParallaxScroll speed={0.04}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">20+</div>
                <div className="text-xs font-mono font-medium text-[var(--neo-text)]/60 mt-1 uppercase tracking-wider">Curated Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">&lt; 3 Mins</div>
                <div className="text-xs font-mono font-medium text-[var(--neo-text)]/60 mt-1 uppercase tracking-wider">Average Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">98.9%</div>
                <div className="text-xs font-mono font-medium text-[var(--neo-text)]/60 mt-1 uppercase tracking-wider">ATS Resume Match</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">100%</div>
                <div className="text-xs font-mono font-medium text-[var(--neo-text)]/60 mt-1 uppercase tracking-wider">Free & Custom Domain</div>
              </div>
            </div>
          </ParallaxScroll>
        </div>

        {/* Interactive Comparison Section */}
        <div className="mt-28 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight mb-4">
              Why Upgrade Your Portfolio?
            </h2>
            <p className="opacity-70 text-sm sm:text-base font-medium">
              Static PDF resumes get buried in recruiter inboxes. Interactive, AI-tailored portfolios grab instant attention.
            </p>

            {/* Comparison Toggle Buttons */}
            <div className="inline-flex p-1.5 rounded-2xl bg-black/30 border border-white/10 mt-6 backdrop-blur-md">
              <button
                onClick={() => setComparisonTab('before')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${comparisonTab === 'before'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                  : 'text-white/50 hover:text-white'
                  }`}
              >
                📄 Boring PDF Resume
              </button>
              <button
                onClick={() => setComparisonTab('after')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${comparisonTab === 'after'
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-pink-500/20'
                  : 'text-white/50 hover:text-white'
                  }`}
              >
                🚀 Portfolio.io Site
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {comparisonTab === 'before' ? (
              <motion.div
                key="before"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto rounded-3xl bg-rose-950/20 border border-rose-500/30 p-8 text-rose-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center font-bold text-rose-400">✕</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Traditional PDF / Word Resume</h3>
                    <p className="text-xs opacity-70">Low response rate & zero interactive experience</p>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
                  <li className="flex items-center gap-2">⚠️ Standard black & white text with no visual flair</li>
                  <li className="flex items-center gap-2">⚠️ Cannot demonstrate live code or interactive apps</li>
                  <li className="flex items-center gap-2">⚠️ 75% filtered out by archaic ATS scanners</li>
                  <li className="flex items-center gap-2">⚠️ Hard to update or customize per job application</li>
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="after"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-violet-900/30 via-pink-900/20 to-purple-900/30 border border-pink-500/40 p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Portfolio.io Interactive Website</h3>
                    <p className="text-xs opacity-70">High conversion, live demo embeds & automated AI matching</p>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
                  <li className="flex items-center gap-2">✨ 20+ responsive themes & live section reordering</li>
                  <li className="flex items-center gap-2">⚡ 99% ATS Optimization with AI Resume tailoring</li>
                  <li className="flex items-center gap-2">🌐 1-Click custom domain hosting & SSL</li>
                  <li className="flex items-center gap-2">🚀 Live GitHub activity integration & project showcases</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bento Grid Features */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <ParallaxScroll speed={0.05} className="md:col-span-2 md:row-span-2">
            <ParallaxTilt maxDegree={10}>
              <GlassCard className="h-full min-h-[420px] sm:min-h-[440px] flex justify-between flex-col group hover:border-white/40 transition-colors relative overflow-hidden p-6 sm:p-8">
                <div className="w-full bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 p-5 sm:p-6 flex flex-col gap-3 group-hover:bg-white/10 transition-colors duration-500 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-3.5 h-3.5 text-accent-color animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-[var(--neo-text)]/60 font-mono text-[10px] font-bold uppercase tracking-widest">AI Setup Engine</span>
                  </div>
                  <div className="text-[var(--neo-text)] font-bold text-base">Optimal layout generated.</div>
                  <div className="text-[var(--neo-text)]/50 text-xs leading-relaxed max-w-[90%]">Portfolio structure customized based on your recent GitHub activity and resume data.</div>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                    <div className="h-14 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                      <span className="font-bold text-[var(--neo-text)] text-sm">99%</span>
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

                <div className="mt-auto">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold">Intelligent Layouts</h3>
                  <p className="opacity-80 mt-2 text-base sm:text-lg leading-relaxed">Our AI analyzes your data to pick the best presentation format automatically.</p>
                </div>
              </GlassCard>
            </ParallaxTilt>
          </ParallaxScroll>

          <ParallaxScroll speed={-0.08}>
            <ParallaxTilt maxDegree={12}>
              <GlassCard className="h-full min-h-[160px] group hover:border-white/40 transition-colors">
                <h3 className="text-xl font-display font-bold">Lightning Fast</h3>
                <p className="text-sm opacity-80 mt-2">Deployed globally on edge networks for instant load times.</p>
              </GlassCard>
            </ParallaxTilt>
          </ParallaxScroll>

          <ParallaxScroll speed={-0.12}>
            <ParallaxTilt maxDegree={12}>
              <GlassCard className="h-full min-h-[160px] bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/20 group hover:border-violet-500/40 transition-colors">
                <h3 className="text-xl font-display font-bold text-accent-color">Custom Domains</h3>
                <p className="text-sm opacity-80 mt-2">Connect your own domain with one simple click.</p>
              </GlassCard>
            </ParallaxTilt>
          </ParallaxScroll>
        </div>
      </div>

      <div className="z-10 w-full">
        <ParallaxScroll speed={0.08}>
          <FeatureGrid />
        </ParallaxScroll>

        {/* Pricing Table */}
        <PricingTable />

        <ParallaxScroll speed={-0.08}>
          <HowItWorks />
        </ParallaxScroll>

        {/* FAQ Accordion */}
        <FaqAccordion />

        <CallToAction />
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default Home;

