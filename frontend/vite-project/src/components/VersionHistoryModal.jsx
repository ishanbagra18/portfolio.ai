import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Save, RotateCcw, X, Clock, CheckCircle } from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function VersionHistoryModal({ portfolioId, isOpen, onClose, onRestore }) {
  const [versions, setVersions] = useState([]);
  const [versionName, setVersionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchVersions = async () => {
    if (!portfolioId) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}/versions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setVersions(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch versions.');
      }
    } catch (err) {
      setError('Connection error while fetching versions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, portfolioId]);

  const handleSaveVersion = async (e) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ versionName: versionName.trim() })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setVersionName('');
        setSuccessMsg('Version snapshot saved successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
        fetchVersions();
      } else {
        setError(result.message || 'Failed to save version.');
      }
    } catch (err) {
      setError('Connection error while saving version.');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm('Are you sure you want to restore this version snapshot? Unsaved changes will be replaced.')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}/versions/${versionId}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        onRestore(result.data);
        onClose();
      } else {
        setError(result.message || 'Failed to restore version.');
      }
    } catch (err) {
      setError('Connection error while restoring version.');
    } finally {
      setLoading(false);
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
            className="w-full max-w-xl max-h-[85vh] flex flex-col bg-zinc-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl font-sans overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white">Version History &amp; Snapshots</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Snapshot Form */}
            <form onSubmit={handleSaveVersion} className="mb-6 flex gap-3 shrink-0">
              <input
                type="text"
                placeholder="e.g. V2.0 Before Tech Review"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 text-white font-sans transition"
              />
              <button
                type="submit"
                disabled={saving || !versionName.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition shadow-lg shrink-0"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Snapshot'}
              </button>
            </form>

            {successMsg && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4 shrink-0 font-semibold">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm mb-4 font-medium shrink-0">⚠ {error}</p>
            )}

            {/* Version List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {loading ? (
                <p className="text-zinc-400 text-sm text-center py-8 font-mono">Loading history snapshots...</p>
              ) : versions.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8 italic">No saved versions found. Create one above!</p>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white mb-1">{ver.version_name}</h4>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(ver.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRestore(ver.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
