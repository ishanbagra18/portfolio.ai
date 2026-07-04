import React, { useState } from 'react';

const JDTailorWidget = ({ currentData, onTailored }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTailor = async (useExistingData) => {
    if (!jobDescription.trim()) {
      alert("Please paste a target Job Description first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:5000/api/ai/tailor-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          jobDescription,
          currentData: useExistingData ? currentData : null
        })
      });

      const result = await res.json();
      if (res.ok && result.success && result.tailoredData) {
        // Merge tailored details into current form details so we don't lose links/empty keys
        const t = result.tailoredData;
        const merged = {
          personalInfo: {
            ...currentData?.personalInfo,
            ...t.personalInfo,
            // Keep original values if empty
            age: currentData?.personalInfo?.age || '',
            address: currentData?.personalInfo?.address || '',
          },
          techStacks: t.techStacks || currentData?.techStacks || [],
          projects: t.projects || currentData?.projects || [],
          experiences: t.experiences || currentData?.experiences || [],
          certifications: t.certifications || currentData?.certifications || []
        };

        onTailored(merged);
        setIsOpen(false);
        setJobDescription('');
      } else {
        setError(result.message || "Failed to customize details using AI.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection issue. Could not reach AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12 p-6 border border-violet-500/20 bg-slate-950/40 rounded-2xl backdrop-blur relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2 py-0.5 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded text-[9px] font-bold uppercase tracking-wider">
            Gemini Auto-Fill
          </span>
          <h2 className="text-xl font-black text-white mt-1 uppercase tracking-tight">
            Tailor Form with Job Description (JD)
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
            Paste a target Job Description to instantly auto-fill the form with tailored projects, tech stacks, and experiences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-5 py-3 border border-violet-600/40 text-violet-300 font-bold uppercase tracking-widest text-xs hover:bg-violet-600 hover:text-white transition-all rounded-xl whitespace-nowrap cursor-pointer"
        >
          {isOpen ? "Close Auto-Filler" : "✨ Open JD Auto-Filler"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 border-t border-slate-900 pt-6 space-y-4 animate-in fade-in duration-200">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={loading}
            placeholder="Paste the target job description or requirements here..."
            rows="6"
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-violet-500/50 text-slate-200 p-4 rounded-xl text-xs focus:outline-none placeholder:text-slate-700 transition resize-none leading-relaxed"
          />

          {error && (
            <p className="text-red-400 text-xs font-semibold flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {/* Option A: Create tailored mock profile */}
            <button
              type="button"
              onClick={() => handleTailor(false)}
              disabled={loading}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              {loading && !currentData ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  Generating Draft...
                </>
              ) : (
                "✨ Generate New Tailored Draft"
              )}
            </button>

            {/* Option B: Tailor current data (only show if currentData has some meaningful inputs) */}
            {currentData && (
              <button
                type="button"
                onClick={() => handleTailor(true)}
                disabled={loading}
                className="px-5 py-3 border border-slate-700 hover:border-violet-600 text-slate-300 hover:text-white disabled:opacity-50 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                {loading && currentData ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin inline-block" />
                    Tailoring Current Data...
                  </>
                ) : (
                  "🛠️ Optimize My Current Data"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JDTailorWidget;
