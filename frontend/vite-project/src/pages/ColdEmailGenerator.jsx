import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ParallaxTilt, ParallaxBackground } from '../components/ui/Parallax';
import { API_BASE } from '../lib/api';
import { getToken } from '../lib/auth';

const ColdEmailGenerator = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('confident');

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [findingHR, setFindingHR] = useState(false);
  const [alternateEmails, setAlternateEmails] = useState([]);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [generatedData, setGeneratedData] = useState(null);
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('pitch'); // 'pitch' | 'cover' | 'highlights'
  const [editableBody, setEditableBody] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserPortfolios = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/portfolio/my-portfolios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok && result.success && result.data) {
          setPortfolios(result.data);
          if (result.data.length > 0) {
            setSelectedPortfolioId(result.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load user portfolios:", err);
      }
    };
    fetchUserPortfolios();
  }, []);

  const handleAutoFindHR = async (companyToFind) => {
    const targetComp = companyToFind || companyName;
    if (!targetComp.trim()) return;

    setFindingHR(true);
    setError(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/ai/find-hr-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ companyName: targetComp })
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        if (result.data.primaryEmail) {
          setRecipientEmail(result.data.primaryEmail);
        }
        if (result.data.hrTitle) {
          setRecipientName(result.data.hrTitle);
        }
        if (Array.isArray(result.data.alternateEmails)) {
          setAlternateEmails(result.data.alternateEmails);
        }
      }
    } catch (err) {
      console.error("HR Auto-discovery error:", err);
    } finally {
      setFindingHR(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please paste the target job description or requirements.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/ai/generate-cold-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolioId,
          jobDescription,
          companyName,
          recipientName,
          tone
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to generate cold email pitch.');
      }

      setGeneratedData(result.data);
      setActiveSubjectIdx(0);
      setEditableBody(result.data.emailBody);
      setActiveTab('pitch');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      setError('Please enter the target HR / Hiring Manager email address before sending.');
      return;
    }

    if (!generatedData) return;

    setSending(true);
    setError(null);
    setStatusMessage(null);

    try {
      const token = getToken();
      const currentSubject = generatedData.subjectOptions?.[activeSubjectIdx] || `Application for ${companyName || 'Role'}`;
      const currentBody = activeTab === 'cover' ? generatedData.coverLetter : editableBody;

      const response = await fetch(`${API_BASE}/api/ai/send-cold-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          recipientEmail,
          subject: currentSubject,
          body: currentBody
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send cold email.');
      }

      setStatusMessage(result.message || `Cold email pitch dispatched to ${recipientEmail}!`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send cold email to HR.');
    } finally {
      setSending(false);
    }
  };

  const handleCopyClipboard = () => {
    const textToCopy = activeTab === 'cover' ? generatedData?.coverLetter : editableBody;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const mailtoUrl = () => {
    if (!generatedData) return '#';
    const currentSubject = encodeURIComponent(generatedData.subjectOptions?.[activeSubjectIdx] || `Application for ${companyName || 'Role'}`);
    const currentBody = encodeURIComponent(activeTab === 'cover' ? generatedData.coverLetter : editableBody);
    return `mailto:${recipientEmail || ''}?subject=${currentSubject}&body=${currentBody}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-aurora text-[var(--neo-text)] font-sans relative overflow-x-hidden pb-24"
    >
      <div className="noise-overlay" />
      <ParallaxBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-4 sm:mt-8 z-10 relative">
        {/* Title Header */}
        <div className="border-b border-black/10 dark:border-white/10 pb-6 sm:pb-8 mb-8 sm:mb-12">
          <div className="inline-block px-3 py-1 bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-accent-color mb-4 rounded">
            ⚡ AI Career Suite & Direct HR Outreach
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
            Automated Cold Email <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">Generator</span>
          </h1>
          <p className="opacity-80 text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            Match your portfolio highlights against target job postings, auto-discover company HR & recruiter emails, and send high-converting pitches instantly.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5">
            <ParallaxTilt maxDegree={6}>
              <GlassCard className="p-5 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-[var(--neo-text)]">
                    Outreach Settings
                  </h2>
                  {findingHR && (
                    <span className="text-[10px] font-bold text-accent-color uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-accent-color" />
                      Auto-Finding HR Email...
                    </span>
                  )}
                </div>

                <form onSubmit={handleGenerate} className="space-y-5">
                  {/* Select Portfolio */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                      Select Portfolio Profile
                    </label>
                    <select
                      value={selectedPortfolioId}
                      onChange={(e) => setSelectedPortfolioId(e.target.value)}
                      className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 text-sm text-[var(--neo-text)] focus:outline-none focus:border-accent-color transition"
                    >
                      <option value="" className="bg-slate-900 text-white">Default Profile Highlights</option>
                      {portfolios.map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                          {p.full_name} — {p.main_title} ({p.template_id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company Name & Auto Find Trigger */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                        Target Company Name / Domain
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoFindHR(companyName)}
                        className="text-[10px] font-bold uppercase tracking-wider text-pink-400 hover:text-pink-300 transition"
                      >
                        🔍 Auto-Find HR Email
                      </button>
                    </div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      onBlur={() => handleAutoFindHR(companyName)}
                      placeholder="e.g. Stripe, Linear, Razorpay"
                      className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 text-sm text-[var(--neo-text)] focus:outline-none focus:border-accent-color transition"
                    />
                  </div>

                  {/* Hiring Manager & Target Email */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                        Discovered Hiring Manager / HR Title
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Stripe Talent Acquisition Team"
                        className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 text-sm text-[var(--neo-text)] focus:outline-none focus:border-accent-color transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                        Target HR Email Address (Auto-Discovered)
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="e.g. careers@stripe.com or hr@company.com"
                        className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 text-sm text-[var(--neo-text)] focus:outline-none focus:border-accent-color transition font-mono"
                      />
                    </div>

                    {/* Alternate Email Pills */}
                    {alternateEmails.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                          Discovered Alternate Company HR Contacts (Click to Select):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {alternateEmails.map((altEm, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRecipientEmail(altEm)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition ${
                                recipientEmail === altEm
                                  ? 'bg-pink-500/20 border-accent-color text-accent-color font-bold'
                                  : 'bg-white/5 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                              }`}
                            >
                              {altEm}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tone Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                      Pitch Tone Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['confident', 'direct', 'enthusiastic', 'formal'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTone(t)}
                          className={`py-2 px-1 text-[11px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                            tone === t
                              ? 'bg-accent-color text-white border-accent-color shadow-lg shadow-pink-500/20'
                              : 'bg-white/5 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job Description Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
                      Target Job Description / Requirements
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description, required technical stack, or role responsibilities..."
                      rows={6}
                      className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-xs leading-relaxed text-[var(--neo-text)] focus:outline-none focus:border-accent-color transition resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold text-center">
                      ⚠ {error}
                    </div>
                  )}

                  {statusMessage && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center">
                      ✓ {statusMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full py-4 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pink-500/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Custom Pitch...
                      </>
                    ) : (
                      '⚡ Generate Cold Pitch & Cover Letter →'
                    )}
                  </Button>
                </form>
              </GlassCard>
            </ParallaxTilt>
          </div>

          {/* Right Column: Generated Email Studio */}
          <div className="lg:col-span-7">
            {generatedData ? (
              <ParallaxTilt maxDegree={4}>
                <GlassCard className="p-8 space-y-6">
                  {/* Top Bar Tabs & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                      <button
                        onClick={() => { setActiveTab('pitch'); setEditableBody(generatedData.emailBody); }}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                          activeTab === 'pitch' ? 'bg-accent-color text-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        Cold Pitch
                      </button>
                      <button
                        onClick={() => { setActiveTab('cover'); setEditableBody(generatedData.coverLetter); }}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                          activeTab === 'cover' ? 'bg-accent-color text-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        Cover Letter
                      </button>
                      <button
                        onClick={() => setActiveTab('highlights')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                          activeTab === 'highlights' ? 'bg-accent-color text-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        Match Points
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyClipboard}
                        className="px-3.5 py-2 border border-black/10 dark:border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                      >
                        {copied ? '✓ Copied' : '📋 Copy'}
                      </button>
                      <a
                        href={mailtoUrl()}
                        className="px-3.5 py-2 border border-black/10 dark:border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5"
                      >
                        ✉️ Mail App
                      </a>
                    </div>
                  </div>

                  {/* Subject Line Switcher */}
                  {activeTab !== 'highlights' && generatedData.subjectOptions?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block">
                        Subject Line Options (Click to Select)
                      </span>
                      <div className="space-y-2">
                        {generatedData.subjectOptions.map((subj, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveSubjectIdx(idx)}
                            className={`p-3 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                              activeSubjectIdx === idx
                                ? 'bg-pink-500/10 border-accent-color text-accent-color'
                                : 'bg-white/5 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span className="font-mono text-[10px] opacity-60 mr-2">Option {idx + 1}:</span>
                            {subj}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Body Content / Editor */}
                  {activeTab === 'highlights' ? (
                    <div className="space-y-4 pt-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-accent-color">
                        🎯 Key Matching Portfolio Highlights
                      </h3>
                      <div className="space-y-3">
                        {generatedData.matchedPoints?.map((pt, idx) => (
                          <div key={idx} className="p-4 border border-black/10 dark:border-white/10 bg-white/5 rounded-xl text-xs leading-relaxed flex items-start gap-3">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                        <span>{activeTab === 'cover' ? 'Formal Cover Letter' : 'Cold Pitch Body (Editable)'}</span>
                        <span>{editableBody.length} characters</span>
                      </div>
                      <textarea
                        value={editableBody}
                        onChange={(e) => setEditableBody(e.target.value)}
                        rows={14}
                        className="w-full bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-xs font-mono leading-relaxed text-slate-200 focus:outline-none focus:border-accent-color transition resize-none"
                      />
                    </div>
                  )}

                  {/* Send Email Action Bar */}
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs opacity-70 font-mono">
                      Recipient HR: <span className="font-bold text-[var(--neo-text)]">{recipientEmail || 'Not specified'}</span>
                    </div>

                    <Button
                      onClick={handleSendEmail}
                      disabled={sending || !recipientEmail}
                      variant="primary"
                      className="w-full sm:w-auto px-8 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pink-500/20"
                    >
                      {sending ? 'Sending Email to HR...' : '🚀 Send Email to HR Now'}
                    </Button>
                  </div>
                </GlassCard>
              </ParallaxTilt>
            ) : (
              <GlassCard className="p-16 flex flex-col items-center justify-center text-center border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-black/10 dark:border-white/10">
                  ✉️
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-2">
                  No Pitch Generated Yet
                </h3>
                <p className="text-xs opacity-60 max-w-sm leading-relaxed mb-6">
                  Enter the target company name on the left to auto-discover HR emails, paste the job description, and click generate to create custom pitches.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ColdEmailGenerator;
