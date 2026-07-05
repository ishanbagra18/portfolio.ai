import { API_BASE } from '../lib/api';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

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
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/resume/ats-check`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        throw new Error(resData.error || 'Failed to analyze resume.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error. Please try again.');
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
    <div className="min-h-screen bg-black text-white font-sans p-8 md:p-16 relative overflow-hidden">
      {/* Background Gradient glow */}
      <div className="absolute right-0 top-0 w-2/3 h-full opacity-40 pointer-events-none bg-gradient-to-bl from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
      <div className="absolute left-0 bottom-0 w-1/2 h-1/2 opacity-20 pointer-events-none bg-gradient-to-tr from-cyan-500/20 to-transparent blur-3xl" />

      <Navbar />

      <div className="z-10 max-w-6xl mx-auto mt-8 pb-20">
        {/* Header Title */}
        <div className="border-b border-zinc-900 pb-8 mb-12">
          <div className="inline-block px-3 py-1 border border-zinc-700 bg-zinc-950 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
            AI Analyzer
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Resume ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Scanner</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            Upload your resume to get instant ATS feedback. Find structural mistakes, missing keywords, content issues, and receive actionable steps to optimize your resume.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="p-12 border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-3xl bg-zinc-950/40 backdrop-blur-md transition-all flex flex-col items-center justify-center text-center group">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                  📄
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
                  Select Resume File
                </h3>
                <p className="text-zinc-500 text-xs mb-8 max-w-xs leading-relaxed">
                  Supports PDF or DOCX format. Keep formatting standard for best analysis.
                </p>

                <label className="cursor-pointer px-6 py-3 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white bg-zinc-900/60 transition-all font-bold uppercase tracking-widest text-xs rounded-xl">
                  {file ? file.name : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold text-center">
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Scanning Resume with AI...
                  </>
                ) : (
                  'Scan Resume Now →'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-12 animate-fade-in">
            {/* Score Grid Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Overall Circular Score Chart */}
              <div className="lg:col-span-4 p-8 border border-zinc-800 bg-zinc-950/40 rounded-3xl backdrop-blur-md flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">ATS Compatibility</span>
                <div className={`relative w-44 h-44 rounded-full flex items-center justify-center border-8 border-zinc-900 ${getScoreColorClass(result.atsScore)}`}>
                  <div className="text-center">
                    <span className="text-6xl font-black tracking-tighter leading-none block">{result.atsScore}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Score</span>
                  </div>
                </div>
                <h4 className="mt-8 text-lg font-bold uppercase tracking-tight text-white">
                  {result.atsScore >= 80 ? '🔥 Great Fit!' : result.atsScore >= 50 ? '⚠️ Needs Work' : '🚨 High Risk'}
                </h4>
              </div>

              {/* Subscores & Summary info */}
              <div className="lg:col-span-8 p-8 border border-zinc-800 bg-zinc-950/40 rounded-3xl backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Analysis Overview</span>
                  <p className="text-zinc-300 text-lg leading-relaxed font-light">
                    {result.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 border-t border-zinc-900 pt-6">
                  <div className={`p-4 border rounded-2xl ${getScoreColorClass(result.formattingScore)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 block">Formatting Score</span>
                    <span className="text-2xl font-black">{result.formattingScore} / 100</span>
                  </div>
                  <div className={`p-4 border rounded-2xl ${getScoreColorClass(result.contentScore)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 block">Content Score</span>
                    <span className="text-2xl font-black">{result.contentScore} / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mistakes & Recommendations Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Mistakes Column */}
              <div className="p-8 border border-zinc-800 bg-zinc-950/40 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-red-400">Identified Mistakes</h3>
                </div>
                <ul className="space-y-4">
                  {result.mistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed border-b border-zinc-900/60 pb-3">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Improvements Column */}
              <div className="p-8 border border-zinc-800 bg-zinc-950/40 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">🚀</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-emerald-400">Recommended Steps</h3>
                </div>
                <ul className="space-y-4">
                  {result.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed border-b border-zinc-900/60 pb-3">
                      <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Keyword tag cloud */}
            <div className="p-8 border border-zinc-800 bg-zinc-950/40 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🏷️</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-violet-400">Recommended Keywords to Include</h3>
              </div>
              <p className="text-zinc-500 text-xs mb-6">
                Adding these missing skills or keywords to your resume content will significantly boost search matching scores.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {result.missingKeywords.map((kw, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-2 bg-violet-950/30 border border-violet-800/40 hover:border-violet-500 text-violet-300 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition-all uppercase"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-4 border-t border-zinc-900 pt-8">
              <button
                type="button"
                onClick={() => { setFile(null); setResult(null); }}
                className="px-6 py-3.5 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
              >
                Scan Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsChecker;
