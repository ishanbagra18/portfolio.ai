import { API_BASE } from '../lib/api';
import { getToken } from '../lib/auth';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { ParallaxTilt, ParallaxBackground } from '../components/ui/Parallax';

const AtsChecker = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF or DOCX resume file.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = getToken() || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/resume/ats-check`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.error || resData.message || `Server error (${response.status})`);
      }

      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        throw new Error(resData.error || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error('ATS Upload Error:', err);
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError(`Unable to connect to backend server at ${API_BASE}. Please make sure the backend server is running on port 5000.`);
      } else {
        setError(err.message || 'Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to get score colors
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-aurora text-[var(--neo-text)] font-sans relative overflow-x-hidden"
    >
      <div className="noise-overlay" />
      <ParallaxBackground />

      <Navbar />

      <div className="z-10 max-w-6xl mx-auto px-6 md:px-12 mt-8 pb-20 relative">
        {/* Header Title */}
        <div className="border-b border-black/10 dark:border-white/10 pb-8 mb-12">
          <div className="inline-block px-3 py-1 bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-accent-color mb-4 rounded">
            AI Analyzer
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
            Resume ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">Scanner</span>
          </h1>
          <p className="opacity-80 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            Upload your resume to get instant ATS feedback. Find structural mistakes, missing keywords, content issues, and receive actionable steps to optimize your resume.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleUpload} className="space-y-6">
              <ParallaxTilt>
                <GlassCard className="flex flex-col items-center justify-center text-center group border-dashed hover:border-accent-color/50 transition-all p-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-black/10 dark:border-white/10 group-hover:border-accent-color/30 transition-colors shadow-lg shadow-black/20">
                  📄
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-2">
                  Select Resume File
                </h3>
                <p className="opacity-60 text-xs mb-8 max-w-xs leading-relaxed">
                  Supports PDF or DOCX format. Keep formatting standard for best analysis.
                </p>

                <label className="cursor-pointer px-6 py-3 border border-black/20 dark:border-white/20 hover:border-accent-color/50 bg-white/5 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-black/10">
                  {file ? file.name : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </GlassCard>
              </ParallaxTilt>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold text-center">
                  ⚠ {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-4 text-sm font-black  hover:bg-pink-500/20 uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white  border-t-transparent rounded-full animate-spin" />
                    Scanning Resume with AI...
                  </>
                ) : (
                  'Scan Resume Now →'
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-12 animate-fade-in">
            {/* Score Grid Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Overall Circular Score Chart */}
              <GlassCard className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8">
                <span className="text-xs font-bold opacity-60 uppercase tracking-widest mb-6">ATS Compatibility</span>
                <div className={`relative w-44 h-44 rounded-full flex items-center justify-center border-8 border-white/5 ${getScoreColorClass(result.atsScore)}`}>
                  <div className="text-center">
                    <span className="text-6xl font-display font-black tracking-tighter leading-none block">{result.atsScore}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Score</span>
                  </div>
                </div>
                <h4 className="mt-8 text-lg font-display font-bold uppercase tracking-tight">
                  {result.atsScore >= 80 ? '🔥 Great Fit!' : result.atsScore >= 50 ? '⚠️ Needs Work' : '🚨 High Risk'}
                </h4>
              </GlassCard>

              {/* Subscores & Summary info */}
              <GlassCard className="lg:col-span-8 flex flex-col justify-between p-8">
                <div>
                  <span className="text-xs font-bold opacity-60 uppercase tracking-widest mb-3 block">Analysis Overview</span>
                  <p className="text-lg leading-relaxed font-light opacity-90">
                    {result.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 border-t border-black/10 dark:border-white/10 pt-6">
                  <div className={`p-4 border rounded-2xl ${getScoreColorClass(result.formattingScore)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 block">Formatting Score</span>
                    <span className="text-2xl font-display font-black">{result.formattingScore} / 100</span>
                  </div>
                  <div className={`p-4 border rounded-2xl ${getScoreColorClass(result.contentScore)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 block">Content Score</span>
                    <span className="text-2xl font-display font-black">{result.contentScore} / 100</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Mistakes & Recommendations Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Mistakes Column */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-red-400">Identified Mistakes</h3>
                </div>
                <ul className="space-y-4">
                  {result.mistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed border-b border-black/10 dark:border-white/10 pb-3 opacity-80">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Actionable Improvements Column */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">🚀</span>
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-emerald-400">Recommended Steps</h3>
                </div>
                <ul className="space-y-4">
                  {result.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed border-b border-black/10 dark:border-white/10 pb-3 opacity-80">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </GlassCard>

            </div>

            {/* Keyword tag cloud */}
            <GlassCard className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🏷️</span>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight text-accent-color">Recommended Keywords to Include</h3>
              </div>
              <p className="text-xs mb-6 opacity-60">
                Adding these missing skills or keywords to your resume content will significantly boost search matching scores.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {result.missingKeywords.map((kw, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-2 bg-accent-color/10 border border-accent-color/20 text-accent-color rounded-xl text-xs font-semibold tracking-wide uppercase"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Action Bar */}
            <div className="flex justify-end gap-4 border-t border-black/10 dark:border-white/10 pt-8">
              <Button
                type="button"
                onClick={() => { setFile(null); setResult(null); }}
                variant="neo"
                className="font-bold uppercase tracking-widest text-xs"
              >
                Scan Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AtsChecker;
