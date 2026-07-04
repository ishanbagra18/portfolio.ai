import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JobMatcher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [report, setReport] = useState(null);

  // Fetch portfolio owner's name for context on mount
  useEffect(() => {
    const fetchPortfolioDetails = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        const result = await res.json();
        if (res.ok && result.success && result.data) {
          setPortfolioName(result.data.personalInfo?.full_name || 'Your Portfolio');
        }
      } catch (err) {
        console.error("Error fetching portfolio name details:", err);
      }
    };
    if (id) {
      fetchPortfolioDetails();
    }
  }, [id]);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert("Please paste a Job Description to begin matching.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/api/ai/match-job/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ jobDescription }),
      });

      const result = await res.json();
      if (res.ok && result.success && result.report) {
        setReport(result.report);
      } else {
        setError(result.message || "Failed to analyze the Job Description. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the AI matching service. Verify server connection.");
    } finally {
      setLoading(false);
    }
  };

  // Determine score color classes
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 45) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/myportfolios"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider mb-8 transition-colors"
        >
          &larr; Back to Portfolios
        </Link>

        {/* Header Title */}
        <div className="border-b border-slate-900 pb-8 mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-violet-600/10 border border-violet-500/20 text-violet-300 rounded text-[10px] font-bold uppercase tracking-wider">
              Gemini Powered
            </span>
            <span className="text-slate-500 text-xs font-semibold">
              Real-time audit
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
            Smart Skill Matcher
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Compare your profile against any job description to discover matching strengths and key missing skills.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Job Description Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 sm:p-8 backdrop-blur">
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
                Target Role Details
              </h3>
              <p className="text-slate-400 text-xs mb-6">
                Paste the full job description or list of requirements for the position you want to target.
              </p>

              <form onSubmit={handleAudit} className="space-y-6">
                <div className="flex flex-col">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the responsibilities, required tech stack, or description here..."
                    rows="10"
                    disabled={loading}
                    className="bg-slate-950/60 border border-slate-800 focus:border-violet-500/50 text-slate-200 p-4 rounded-xl text-sm focus:outline-none placeholder:text-slate-600 transition resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Match...
                    </>
                  ) : (
                    <>
                      <span>Analyze Job Match</span>
                      <span className="text-xs">⚡</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: AI Analysis Report */}
          <div className="lg:col-span-7 space-y-8">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl flex items-center justify-between">
                <span>⚠ {error}</span>
              </div>
            )}

            {!report && !loading && !error && (
              <div className="bg-slate-900/10 border border-dashed border-slate-900 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                  📊
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Report Generated</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Paste the requirements in the text field on the left and click analyze to generate your custom AI matching score report.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                {/* Skeleton Cards */}
                <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl animate-pulse flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl animate-pulse space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                </div>
              </div>
            )}

            {report && !loading && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
                {/* Score Header Card */}
                <div className={`p-6 sm:p-8 border rounded-3xl flex flex-col sm:flex-row items-center gap-6 ${getScoreColor(report.matchPercentage)}`}>
                  {/* Big Percentage Indicator */}
                  <div className="w-24 h-24 rounded-full border-4 border-current flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
                    {report.matchPercentage}%
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                      Role Alignment Score
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {report.matchPercentage >= 75
                        ? "Excellent alignment! Your profile demonstrates strong keyword matching with this job specification."
                        : report.matchPercentage >= 45
                        ? "Moderate alignment. You have matching credentials, but adding missing skills would significantly improve compatibility."
                        : "Low alignment. Highlight more matching skills, tools, or relevant projects to grab recruiters' attention."}
                    </p>
                  </div>
                </div>

                {/* Grid for Strengths & Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>✔</span> Matching Strengths
                    </h4>
                    {report.strengths?.length > 0 ? (
                      <ul className="space-y-3">
                        {report.strengths.map((str, idx) => (
                          <li key={idx} className="text-slate-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-xs italic">No direct matching strengths identified.</p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>⚠</span> Missing Keywords / Tools
                    </h4>
                    {report.missingSkills?.length > 0 ? (
                      <ul className="space-y-3">
                        {report.missingSkills.map((sk, idx) => (
                          <li key={idx} className="text-slate-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                            <span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-xs italic">No critical missing keywords identified.</p>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 sm:p-8">
                  <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>✨</span> Actionable Suggestions
                  </h4>
                  {report.recommendations?.length > 0 ? (
                    <div className="space-y-4">
                      {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-slate-300 text-xs sm:text-sm leading-relaxed flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-violet-600/10 text-violet-400 border border-violet-500/20 text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs italic">No specific suggestions generated.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;
