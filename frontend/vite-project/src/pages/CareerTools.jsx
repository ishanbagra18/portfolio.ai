import { API_BASE } from '../lib/api';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CareerTools = () => {
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState('match'); // 'match', 'cover-letter', 'interview-prep'
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Results
  const [report, setReport] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);
  
  // Loaders & Errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume (PDF/DOCX) to begin.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please paste a Job Description to begin.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      let endpoint = '';
      if (activeTab === 'match') endpoint = `${API_BASE}/api/ai/match-job`;
      else if (activeTab === 'cover-letter') endpoint = `${API_BASE}/api/ai/cover-letter`;
      else if (activeTab === 'interview-prep') endpoint = `${API_BASE}/api/ai/interview-prep`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData, // fetch automatically sets the correct multipart boundary header
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        if (activeTab === 'match' && result.report) setReport(result.report);
        else if (activeTab === 'cover-letter' && result.coverLetter) setCoverLetter(result.coverLetter);
        else if (activeTab === 'interview-prep' && result.prepData) setInterviewPrep(result.prepData);
        else setError("Failed to generate response. Invalid format returned.");
      } else {
        setError(result.message || result.error || "Failed to process request.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the AI service. Verify server connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      alert("Cover Letter copied to clipboard!");
    }
  };

  // Determine score color classes
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5';
    if (score >= 45) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] font-sans relative overflow-x-hidden pb-24">
      <div className="noise-overlay" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-16 relative z-10">
        {/* Back Link */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-xs font-bold opacity-60 text-[var(--neo-text)] hover:text-[var(--neo-text)] uppercase tracking-wider mb-6 sm:mb-8 transition-colors"
        >
          &larr; Back to Home
        </Link>

        {/* Header Title */}
        <div className="border-b border-white/5 pb-6 sm:pb-8 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-300 rounded text-[10px] font-bold uppercase tracking-wider">
              Gemini Powered
            </span>
            <span className="opacity-60 text-[var(--neo-text)] text-xs font-semibold">
              AI Career Tools
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[var(--neo-text)]">
            Job Matcher & Prep
          </h1>
          <p className="opacity-80 text-[var(--neo-text)] text-sm md:text-base mt-2">
            Upload your resume and analyze JD alignment, generate tailored cover letters, and practice targeted interview questions.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block">New Feature</span>
              <p className="text-sm font-bold text-white">Automated Cold Email Pitch & HR Outreach Suite</p>
            </div>
            <Link
              to="/cold-email-generator"
              className="px-5 py-2.5 bg-accent-color hover:bg-pink-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg shrink-0 w-full sm:w-auto text-center"
            >
              Launch Generator &rarr;
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-5 sm:p-8 backdrop-blur sticky top-8">
              <h3 className="text-lg font-bold text-[var(--neo-text)] mb-2 uppercase tracking-wide">
                Target Role Details
              </h3>
              <p className="opacity-80 text-[var(--neo-text)] text-xs mb-6">
                Upload your resume and paste the target job description below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* File Upload */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold opacity-80 text-[var(--neo-text)] uppercase tracking-wider mb-2">
                    Resume (PDF / DOCX)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="block w-full text-xs sm:text-sm opacity-80 text-[var(--neo-text)]
                      file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-bold file:uppercase file:tracking-wider
                      file:bg-fuchsia-600/10 file:text-fuchsia-400
                      hover:file:bg-fuchsia-600/20 file:transition-colors file:cursor-pointer
                      bg-[var(--neo-bg)]/20 border border-black/10 dark:border-white/10 rounded-xl p-2"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold opacity-80 text-[var(--neo-text)] uppercase tracking-wider mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the responsibilities, required tech stack, or description here..."
                    rows="8"
                    disabled={loading}
                    className="bg-[var(--neo-bg)]/20 border border-black/10 dark:border-white/10 focus:border-fuchsia-500/50 text-[var(--neo-text)] p-4 rounded-xl text-sm focus:outline-none placeholder:text-slate-600 transition resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-[var(--neo-text)] font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-fuchsia-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>
                        {activeTab === 'match' && 'Analyze Job Match'}
                        {activeTab === 'cover-letter' && 'Generate Cover Letter'}
                        {activeTab === 'interview-prep' && 'Generate Interview Prep'}
                      </span>
                      <span className="text-xs">⚡</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: AI Analysis Report & Tabs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs */}
            <div className="flex flex-wrap sm:flex-nowrap p-1 bg-white/10 border border-black/10 dark:border-white/10 rounded-xl w-full sm:w-fit mb-8 gap-1 sm:gap-0">
              <button
                onClick={() => setActiveTab('match')}
                className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'match' ? 'bg-white/20 text-[var(--neo-text)] shadow-sm' : 'opacity-60 text-[var(--neo-text)] hover:text-[var(--neo-text)] hover:bg-white/20/50'
                }`}
              >
                Match Score
              </button>
              <button
                onClick={() => setActiveTab('cover-letter')}
                className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'cover-letter' ? 'bg-white/20 text-[var(--neo-text)] shadow-sm' : 'opacity-60 text-[var(--neo-text)] hover:text-[var(--neo-text)] hover:bg-white/20/50'
                }`}
              >
                Cover Letter
              </button>
              <button
                onClick={() => setActiveTab('interview-prep')}
                className={`flex-1 sm:flex-none text-center px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'interview-prep' ? 'bg-white/20 text-[var(--neo-text)] shadow-sm' : 'opacity-60 text-[var(--neo-text)] hover:text-[var(--neo-text)] hover:bg-white/20/50'
                }`}
              >
                Interview Prep
              </button>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl flex items-center justify-between">
                <span>⚠ {error}</span>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl animate-pulse flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/3"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl animate-pulse space-y-3">
                  <div className="h-4 bg-white/20 rounded w-1/4"></div>
                  <div className="h-3 bg-white/20 rounded w-full"></div>
                  <div className="h-3 bg-white/20 rounded w-5/6"></div>
                </div>
              </div>
            )}

            {/* Empty States */}
            {!loading && !error && activeTab === 'match' && !report && (
              <EmptyState title="No Match Report" desc="Upload your resume and JD to analyze your match score." icon="📊" />
            )}
            {!loading && !error && activeTab === 'cover-letter' && !coverLetter && (
              <EmptyState title="No Cover Letter" desc="Upload your resume and JD to generate a tailored letter." icon="✉" />
            )}
            {!loading && !error && activeTab === 'interview-prep' && !interviewPrep && (
              <EmptyState title="No Interview Prep" desc="Upload your resume and JD for targeted interview questions." icon="🎤" />
            )}

            {/* Output: Match Score */}
            {!loading && activeTab === 'match' && report && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className={`p-6 sm:p-8 border rounded-3xl flex flex-col sm:flex-row items-center gap-6 ${getScoreColor(report.matchPercentage)}`}>
                  <div className="w-24 h-24 rounded-full border-4 border-current flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
                    {report.matchPercentage}%
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black uppercase tracking-tight text-[var(--neo-text)] mb-1">Role Alignment Score</h3>
                    <p className="opacity-80 text-[var(--neo-text)] text-xs sm:text-sm leading-relaxed">
                      {report.matchPercentage >= 75
                        ? "Excellent alignment! Your profile demonstrates strong keyword matching with this job specification."
                        : report.matchPercentage >= 45
                        ? "Moderate alignment. You have matching credentials, but adding missing skills would significantly improve compatibility."
                        : "Low alignment. Highlight more matching skills, tools, or relevant projects to grab recruiters' attention."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <h4 className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>✔</span> Matching Strengths
                    </h4>
                    {report.strengths?.length > 0 ? (
                      <ul className="space-y-3">
                        {report.strengths.map((str, idx) => (
                          <li key={idx} className="text-[var(--neo-text)] text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-fuchsia-500 font-bold mt-0.5">•</span><span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="opacity-60 text-[var(--neo-text)] text-xs italic">No direct matching strengths identified.</p>
                    )}
                  </div>

                  <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>⚠</span> Missing Keywords / Tools
                    </h4>
                    {report.missingSkills?.length > 0 ? (
                      <ul className="space-y-3">
                        {report.missingSkills.map((sk, idx) => (
                          <li key={idx} className="text-[var(--neo-text)] text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                            <span className="text-amber-500 font-bold mt-0.5">•</span><span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="opacity-60 text-[var(--neo-text)] text-xs italic">No critical missing keywords identified.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8">
                  <h4 className="text-xs font-black text-fuchsia-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span>✨</span> Actionable Suggestions
                  </h4>
                  {report.recommendations?.length > 0 ? (
                    <div className="space-y-4">
                      {report.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 bg-[var(--neo-bg)]/20 border border-black/10 dark:border-white/10/80 rounded-xl text-[var(--neo-text)] text-xs sm:text-sm leading-relaxed flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-fuchsia-600/10 text-fuchsia-400 border border-fuchsia-500/20 text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="opacity-60 text-[var(--neo-text)] text-xs italic">No specific suggestions generated.</p>
                  )}
                </div>
              </div>
            )}

            {/* Output: Cover Letter */}
            {!loading && activeTab === 'cover-letter' && coverLetter && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-[var(--neo-text)]">Generated Cover Letter</h3>
                  <button 
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-[var(--neo-text)] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <span>📋</span> Copy Text
                  </button>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl">
                  <p className="text-[var(--neo-text)] text-sm leading-loose whitespace-pre-wrap font-serif">
                    {coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Output: Interview Prep */}
            {!loading && activeTab === 'interview-prep' && interviewPrep && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="border-b border-black/10 dark:border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-[var(--neo-text)]">Tailored Interview Questions</h3>
                  <p className="opacity-80 text-[var(--neo-text)] text-sm mt-1">
                    These questions were generated specifically for your resume against the target JD. Practice answering these 10-15 targeted questions.
                  </p>
                </div>

                <div className="space-y-6">
                  {interviewPrep.questions?.map((q, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 hover:border-black/20 dark:border-white/20 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                          q.type.toLowerCase() === 'technical' 
                            ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20' 
                            : 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20'
                        }`}>
                          {q.type}
                        </span>
                        <span className="opacity-60 text-[var(--neo-text)] text-xs font-semibold">Q{idx + 1}</span>
                      </div>
                      
                      <h4 className="text-lg md:text-xl font-bold text-[var(--neo-text)] mb-3 leading-snug">
                        "{q.question}"
                      </h4>
                      
                      <div className="bg-[var(--neo-bg)]/20 border border-black/10 dark:border-white/10/80 rounded-xl p-5 mt-5 space-y-4">
                        <div>
                          <h5 className="text-[10px] font-bold opacity-60 text-[var(--neo-text)] uppercase tracking-widest mb-1.5">Why they ask this:</h5>
                          <p className="opacity-80 text-[var(--neo-text)] text-sm leading-relaxed">{q.reasoning}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Empty State Component
const EmptyState = ({ title, desc, icon }) => (
  <div className="bg-white/10/10 border border-dashed border-white/5 rounded-3xl p-16 text-center">
    <div className="w-16 h-16 bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[var(--neo-text)] mb-2">{title}</h3>
    <p className="opacity-60 text-[var(--neo-text)] text-sm max-w-sm mx-auto leading-relaxed">
      {desc}
    </p>
  </div>
);

export default CareerTools;
