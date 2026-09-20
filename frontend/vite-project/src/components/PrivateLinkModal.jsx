import React, { useState } from 'react';
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
  const [expiresAt, setExpiresAt] = useState(personalInfo.link_expires_at ? personalInfo.link_expires_at.substring(0, 16) : '');
  const [customDomain, setCustomDomain] = useState(personalInfo.custom_domain || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const payload = {
        personalInfo: {
          ...personalInfo,
          is_password_protected: isProtected,
          access_passcode: passcode,
          link_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          custom_domain: customDomain.trim().toLowerCase() || null
        }
      };

      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess(true);
        if (onUpdate) onUpdate(payload.personalInfo);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } else {
        setError(result.message || 'Failed to update access control settings.');
      }
    } catch (err) {
      setError('Connection error while saving private link options.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 text-[var(--neo-text)] shadow-2xl font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Recruiter Privacy & Domains</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Password Protection */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-sm">Passcode Protection</span>
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
                  <label className="text-xs text-zinc-400 block mb-1">Access Passcode / PIN</label>
                  <input
                    type="text"
                    placeholder="e.g. Recruiter2024!"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-pink-400 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Link Expiration */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm">Expiring Recruiter Link</span>
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
                <span className="font-bold text-sm">Custom Domain</span>
              </div>
              <input
                type="text"
                placeholder="e.g. portfolio.yourname.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-400 text-white font-mono"
              />
            </div>

            {error && <p className="text-red-400 text-sm">⚠ {error}</p>}
            {success && <p className="text-emerald-400 text-sm font-bold">✓ Privacy options updated!</p>}

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition"
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
    </AnimatePresence>
  );
}
