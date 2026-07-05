import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PortfolioCritique = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [critique, setCritique] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingTexts = [
    "Reading profile details...",
    "Scanning project descriptions & technical complexity...",
    "Analyzing work history outcome statements...",
    "Assessing layout structures & readability indexes...",
    "Formulating recruiter feedback points...",
    "Structuring critical hiring manager review..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchCritique = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error("You must be logged in to view critiques.");
        }

        const res = await fetch(`${API_BASE}/api/ai/critique/${portfolioId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await res.json();

        if (res.ok && result.success && result.critique) {
          setCritique(result.critique);
        } else {
          setError(result.message || 'Failed to generate portfolio critique.');
        }
      } catch (err) {
        console.error('Critique Error:', err);
        setError(err.message || 'Something went wrong while connecting to the AI service.');
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) {
      fetchCritique();
    }
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6 font-sans relative overflow-hidden">
        {/* Background light spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative flex flex-col items-center z-10">
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">📋</span>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2 text-center">
            Hiring Manager Review in Progress
          </h2>
          <p className="text-slate-400 text-sm text-center max-w-sm h-6 transition-all duration-300 font-mono">
            {loadingTexts[loadingStep]}
          </p>
        </div>
      </div>
    );
  }

  if (error || !critique) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6 font-sans relative">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-red-500/20 rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl text-red-400">
            ⚠️
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Critique Failed</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {error || 'Unable to review portfolio at this time.'}
          </p>
          <button
            onClick={() => navigate('/my-portfolios')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-sm uppercase tracking-wider"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    overallRating,
    readabilityScore,
    visualAppealCritique,
    structureAndFormatting,
    projectImpact,
    experienceRelevance,
    keyStrengths,
    redFlags,
    actionableTips
  } = critique;

  // Grade helper
  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score >= 80) return { letter: 'A', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' };
    if (score >= 70) return { letter: 'B', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' };
    if (score >= 50) return { letter: 'C', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { letter: 'D', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  const ratingGrade = getGrade(overallRating);
  const readabilityGrade = getGrade(readabilityScore);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-16 px-6 md:px-12 relative overflow-hidden selection:bg-violet-500/30 selection:text-white">
      {/* Background lights */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 opacity-30 pointer-events-none bg-gradient-to-bl from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[120px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-800/80 pb-8">
          <div>
            <button
              onClick={() => navigate('/my-portfolios')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest mb-4 transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              AI Recruiter Critique
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2">
              A comprehensive hiring manager review focused on code impact, formatting logic, and hiring potential.
            </p>
          </div>

          <div className="flex gap-4">
            {/* Overall score circular display */}
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${ratingGrade.bg} ${ratingGrade.border}`}>
              <div className="text-center">
                <div className={`text-3xl font-black leading-none ${ratingGrade.color}`}>{overallRating}%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Hiring Score</div>
              </div>
              <div className={`text-4xl font-black ${ratingGrade.color} select-none border-l border-slate-800/60 pl-3`}>
                {ratingGrade.letter}
              </div>
            </div>

            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${readabilityGrade.bg} ${readabilityGrade.border}`}>
              <div className="text-center">
                <div className={`text-3xl font-black leading-none ${readabilityGrade.color}`}>{readabilityScore}%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Readability</div>
              </div>
              <div className={`text-4xl font-black ${readabilityGrade.color} select-none border-l border-slate-800/60 pl-3`}>
                {readabilityGrade.letter}
              </div>
            </div>
          </div>
        </div>

        {/* Major Critique Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Visual & Structure Review Card */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-8 backdrop-blur-md">
            <h3 className="text-xl font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              1. Presentation & Structure
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Visual Design & Presentation</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{visualAppealCritique}</p>
              </div>

              <div className="pt-6 border-t border-slate-850">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Structure & Layout Logic</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{structureAndFormatting}</p>
              </div>
            </div>
          </div>

          {/* Project & Exp Review Card */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-8 backdrop-blur-md">
            <h3 className="text-xl font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              2. Technical Content Depth
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Content & Impact</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{projectImpact}</p>
              </div>

              <div className="pt-6 border-t border-slate-850">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Work History Relevance</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{experienceRelevance}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Strengths & Red Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Key Strengths */}
          <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-3xl p-8">
            <h3 className="text-xl font-extrabold text-emerald-400 mb-6 uppercase tracking-wider flex items-center gap-2">
              🏆 Key Strengths
            </h3>
            <ul className="space-y-4">
              {keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span className="text-slate-300 text-sm leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Red Flags */}
          <div className="bg-rose-950/10 border border-rose-500/20 rounded-3xl p-8">
            <h3 className="text-xl font-extrabold text-rose-400 mb-6 uppercase tracking-wider flex items-center gap-2">
              🚨 Recruiter Concerns
            </h3>
            {redFlags.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No major red flags detected. Excellent profile!</p>
            ) : (
              <ul className="space-y-4">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                      !
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Actionable Recruiter Tips */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
            <span>💡</span> Hiring Manager Action Plan
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Implement these changes on your portfolio builder forms to directly address the critiques.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionableTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-2xl transition">
                <span className="text-lg text-violet-400 font-bold shrink-0">{idx + 1}.</span>
                <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PortfolioCritique;
