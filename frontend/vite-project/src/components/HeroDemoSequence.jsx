import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Cpu, Layers } from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Resume Upload', subtitle: 'Drag & drop PDF resume' },
  { id: 1, title: 'AI Extraction', subtitle: 'Scanning skills & projects' },
  { id: 2, title: 'Field Auto-Fill', subtitle: 'Populating template data' },
  { id: 3, title: 'Live Portfolio', subtitle: 'Deploys to global edge' }
];

export default function HeroDemoSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-black/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden relative group">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Step Indicators */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Live Product Workflow Demo
          </div>
          <h3 className="text-xl font-bold text-white font-display tracking-tight">
            How Resume to Portfolio Happens
          </h3>
        </div>

        {/* Auto Play / Reset Button */}
        <button
          onClick={() => {
            setIsAutoPlaying(false);
            setCurrentStep((prev) => (prev + 1) % STEPS.length);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white/80 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Next Step
        </button>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStep(step.id);
              }}
              className="text-left group"
            >
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                isActive ? 'bg-gradient-to-r from-pink-500 to-violet-500' : isPassed ? 'bg-violet-400/60' : 'bg-white/10'
              }`} />
              <div className="mt-2 hidden sm:block">
                <div className={`text-[11px] font-bold ${isActive ? 'text-pink-400' : 'text-white/60'}`}>
                  {step.title}
                </div>
                <div className="text-[9px] text-white/40 truncate">{step.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box */}
      <div className="min-h-[280px] sm:min-h-[300px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: RESUME UPLOAD */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-pink-500/40 bg-pink-500/5 text-center relative"
            >
              {/* Floating PDF Resume Icon */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/30 border border-pink-500/50 flex flex-col items-center justify-center shadow-xl shadow-pink-500/10 mb-4"
              >
                <FileText className="w-8 h-8 text-pink-400 mb-1" />
                <span className="text-[9px] font-mono font-bold text-white/80">PDF</span>
              </motion.div>

              <div className="text-base font-bold text-white mb-1">Drop Your Resume Here</div>
              <div className="text-xs text-white/60 max-w-xs mb-4">Supports PDF, DOCX, or direct LinkedIn profile import</div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25">
                <span>Resume_Ishan_Bagra.pdf</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}

          {/* STEP 1: AI EXTRACTION */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl border border-white/10 bg-black/50 p-6 relative overflow-hidden"
            >
              {/* Laser Scan Animation Line */}
              <motion.div
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06b6d4] z-20 pointer-events-none"
              />

              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  Gemini AI Parsing Resume Data...
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">Parsing 94%</div>
              </div>

              <div className="space-y-3">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-white/60">Candidate Name:</span>
                  <span className="font-bold text-white">Ishan Bagra</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-white/60">Skills Extracted:</span>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[10px]">React</span>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[10px]">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">Python</span>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <span className="text-white/60">Projects Identified:</span>
                  <span className="font-bold text-emerald-400">4 Full-Stack Repos</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: FIELD AUTO-FILL */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl border border-white/10 bg-black/50 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold">
                  <Layers className="w-4 h-4" />
                  Auto-Filling Template Schema
                </div>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px]">Template 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/50 font-mono mb-1">Headline</div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Full-Stack & AI Engineer</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/50 font-mono mb-1">Section Order</div>
                  <div className="font-bold text-pink-300 flex items-center gap-2">
                    <span>About → Projects → Experience</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/30 text-xs text-violet-200 flex items-center justify-between">
                <span>AI Job Match Score: 99.4% (Matched for Senior Full-Stack Roles)</span>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
            </motion.div>
          )}

          {/* STEP 3: LIVE PORTFOLIO */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-black/60 p-6 relative overflow-hidden text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Portfolio Live & Published!
              </div>

              <h4 className="text-xl font-bold text-white mb-2 font-display">Ishan Bagra — Portfolio</h4>
              <p className="text-xs text-white/70 max-w-sm mx-auto mb-5">
                Deployed instantly with SSL, dark theme customizer, and ATS resume optimizer.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-pink-300 shadow-xl">
                <span>portfolio.io/p/ishan-bagra</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
