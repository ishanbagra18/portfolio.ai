import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';

const CustomSlugModal = ({ portfolio, onClose, onSuccess }) => {
  const currentSlug = portfolio?.public_slug || '';
  const portfolioId = portfolio?._id || portfolio?.id;

  const [slug, setSlug] = useState(currentSlug);
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'taken' | 'invalid'
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Auto-format slug input
  const formatSlug = (val) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const formatted = formatSlug(raw);
    setSlug(formatted);
    setError(null);
  };

  // Debounced availability check
  useEffect(() => {
    if (!slug) {
      setStatus('invalid');
      setStatusMessage('Please enter a custom link name.');
      return;
    }

    if (slug.length < 3 || slug.length > 40) {
      setStatus('invalid');
      setStatusMessage('Link length must be between 3 and 40 characters.');
      return;
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      setStatus('invalid');
      setStatusMessage('Link cannot start or end with a hyphen.');
      return;
    }

    // If matches current slug, it's valid and current
    if (slug === currentSlug) {
      setStatus('available');
      setStatusMessage('This is your current active link!');
      return;
    }

    setStatus('checking');
    setStatusMessage('Checking link availability...');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/portfolio/check-slug/${encodeURIComponent(slug)}?currentPortfolioId=${portfolioId}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          if (data.available) {
            setStatus('available');
            setStatusMessage('✓ Link is available!');
          } else {
            setStatus('taken');
            setStatusMessage('✕ Link is already taken by another user.');
          }
        } else {
          setStatus('invalid');
          setStatusMessage(data.message || 'Invalid link format.');
        }
      } catch (err) {
        console.error('Check slug error:', err);
        setStatus('invalid');
        setStatusMessage('Error verifying link availability.');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slug, currentSlug, portfolioId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (status !== 'available' && slug !== currentSlug) return;

    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}/custom-slug`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(data.data?.public_slug || slug);
        onClose();
      } else {
        setError(data.message || 'Failed to update custom link.');
      }
    } catch (err) {
      console.error('Update custom slug error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const domainPrefix = `${window.location.origin}/p/`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-violet-500/30 rounded-3xl p-8 shadow-2xl shadow-violet-950/50 text-white font-sans overflow-hidden">
        {/* Glow backdrop decorative effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 font-black">
              🔗
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Personalized Link</h3>
              <p className="text-xs text-slate-400">Choose a custom URL for your public portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Custom Handle / Slug
            </label>

            {/* Link Preview Box */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-violet-500 transition-colors">
              <span className="px-3.5 py-3 text-xs font-mono text-slate-500 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
                {domainPrefix}
              </span>
              <input
                type="text"
                value={slug}
                onChange={handleInputChange}
                placeholder="e.g. ishan-bagra"
                className="w-full bg-transparent px-3 py-3 text-white text-sm font-mono focus:outline-none placeholder-slate-600"
                maxLength={40}
                autoFocus
              />
            </div>

            {/* Dynamic Status Feedback */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  status === 'checking'
                    ? 'text-amber-400'
                    : status === 'available'
                    ? 'text-emerald-400'
                    : status === 'taken'
                    ? 'text-red-400'
                    : 'text-slate-400'
                }`}
              >
                {status === 'checking' && (
                  <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                )}
                {statusMessage}
              </span>

              <span className="text-[10px] text-slate-500 font-mono">
                {slug.length}/40
              </span>
            </div>
          </div>

          {/* Quick presets / suggestions */}
          <div className="mb-6 bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Preview Link
            </p>
            <p className="text-xs font-mono text-violet-300 truncate select-all">
              {domainPrefix}{slug || 'your-custom-link'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              ⚠ {error}
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || (status !== 'available' && slug !== currentSlug)}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomSlugModal;
