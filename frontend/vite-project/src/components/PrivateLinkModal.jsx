import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Clock, Globe, X, Save, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function PrivateLinkModal({ 
  portfolioId, 
  personalInfo = {}, 
  isOpen, 
  onClose, 
  onUpdate 
}) {
  const [isProtected, setIsProtected] = useState(personalInfo.is_password_protected || false);
  const [passcode, setPasscode] = useState(personalInfo.access_passcode || '');
  const [expiresAt, setExpiresAt] = useState(personalInfo.link_expires_at ? String(personalInfo.link_expires_at).substring(0, 16) : '');
  const [customDomain, setCustomDomain] = useState(personalInfo.custom_domain || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProtected(Boolean(personalInfo.is_password_protected));
      setPasscode(personalInfo.access_passcode || '');
      setExpiresAt(personalInfo.link_expires_at ? String(personalInfo.link_expires_at).substring(0, 16) : '');
      setCustomDomain(personalInfo.custom_domain || '');
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, personalInfo]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedPersonalInfo = {
        ...personalInfo,
        is_password_protected: isProtected,
        access_passcode: passcode,
        link_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        custom_domain: customDomain ? customDomain.trim() : null
      };

      if (onUpdate) {
        onUpdate(updatedPersonalInfo);
      }

      if (portfolioId && portfolioId !== 'undefined' && portfolioId !== 'new') {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            personalInfo: updatedPersonalInfo
          })
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to update privacy settings on server.');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('PrivateLinkModal save error:', err);
      setError(err.message || 'Could not save privacy settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-lg max-h-[85vh] flex flex-col bg-zinc-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl font-sans overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white">Recruiter Privacy &amp; Domains</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar">
              {/* Password Protection */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-pink-400" />
                    <span className="font-bold text-sm text-white">Passcode Protection</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isProtected}
                    onChange={(e) => setIsProtected(e.target.checked)}
                    className="w-5 h-5 accent-pink-500 cursor-pointer"
                  />
                </div>

                {isProtected && (
                  <div className="mt-3">
                    <label className="text-xs text-zinc-400 block mb-1 font-medium">Access Passcode / PIN</label>
                    <input
                      type="text"
                      placeholder="e.g. Recruiter2024!"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-pink-400 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Link Expiration */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">Expiring Recruiter Link</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Set a time when shared links will automatically deactivate.
                </p>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-amber-400 text-white"
                />
              </div>

              {/* Custom Domain */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white">Custom Domain</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. portfolio.yourname.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-400 text-white font-mono"
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium">⚠ {error}</p>}
              {success && <p className="text-emerald-400 text-sm font-bold">✓ Privacy options updated!</p>}

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-lg"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
