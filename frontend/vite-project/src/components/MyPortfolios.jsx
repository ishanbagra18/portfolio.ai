import { API_BASE } from '../lib/api';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomSlugModal from "./CustomSlugModal";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import Navbar from './Navbar';

/* ---------------- Confirm Delete Modal ---------------- */
const DeleteModal = ({ portfolio, onConfirm, onCancel, isDeleting }) => {
  const fullName = portfolio?.personalInfo?.full_name || portfolio?.full_name || "Untitled Portfolio";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--neo-bg)]/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 w-full max-w-sm glass-panel p-7 border-red-500/30"
      >
        {/* Icon */}
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-5 overflow-hidden">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6 text-red-400"
            animate={isDeleting ? { 
              y: [0, -5, 0], 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={isDeleting ? { 
              repeat: Infinity, 
              duration: 1 
            } : {}}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </motion.svg>
        </div>

        <h3 className="text-xl font-bold font-display text-[var(--neo-text)] text-center mb-2">
          Delete Portfolio?
        </h3>
        <p className="text-[var(--neo-text)] opacity-80 text-sm text-center leading-relaxed mb-7">
          Are you sure you want to delete{" "}
          <span className="text-[var(--neo-text)] font-semibold">"{fullName}"</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            disabled={isDeleting}
            variant="neo"
            className="flex-1 px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            variant="primary"
            className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-500 shadow-red-600/30"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- Copy Link Toast ---------------- */
const CopyToast = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -tranzinc-x-1/2 z-50 px-5 py-3 bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-sm font-bold rounded-xl backdrop-blur-xl shadow-2xl animate-bounce-in flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      Link copied to clipboard!
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const MyPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // portfolio object to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Copy link toast
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Custom link modal state
  const [customSlugTarget, setCustomSlugTarget] = useState(null);

  // Toggle loading state (keyed by portfolio id)
  const [togglingId, setTogglingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPortfolios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        const res = await fetch(`${API_BASE}/api/portfolio/my-portfolios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const result = await res.json();

        if (res.ok) {
          if (result.success && result.data) {
            setPortfolios(result.data);
          } else if (Array.isArray(result)) {
            setPortfolios(result);
          } else {
            setPortfolios([]);
          }
        } else {
          setError(result.message || "Failed to fetch your portfolios.");
        }
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError("Something went wrong while connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPortfolios();
  }, []);

  const handleCardClick = (portfolio) => {
    const portfolioId = portfolio._id || portfolio.id;
    const templateId = portfolio.templateId || portfolio.template_id || "template1";
    if (portfolioId) {
      navigate(`/portfolio/${templateId}/${portfolioId}`);
    }
  };

  /* ---------- Edit Handler ---------- */
  const handleEditClick = (e, portfolio) => {
    e.stopPropagation();
    const portfolioId = portfolio._id || portfolio.id;
    navigate(`/edit-portfolio/${portfolioId}`);
  };

  /* ---------- Delete Handlers ---------- */
  const handleDeleteClick = (e, portfolio) => {
    e.stopPropagation(); // Prevent card click / navigation
    setDeleteError(null);
    setDeleteTarget(portfolio);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const portfolioId = deleteTarget._id || deleteTarget.id;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Optimistically remove from UI
        setPortfolios((prev) =>
          prev.filter((p) => (p._id || p.id) !== portfolioId)
        );
        setDeleteTarget(null);
      } else {
        setDeleteError(result.message || "Failed to delete portfolio.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteTarget(null);
      setDeleteError(null);
    }
  };

  /* ---------- Toggle Public Handler ---------- */
  const handleTogglePublic = async (e, portfolio) => {
    e.stopPropagation();
    const portfolioId = portfolio._id || portfolio.id;
    setTogglingId(portfolioId);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}/toggle-public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Update portfolio in state
        setPortfolios((prev) =>
          prev.map((p) => {
            if ((p._id || p.id) === portfolioId) {
              return {
                ...p,
                is_public: result.data.is_public,
                public_slug: result.data.public_slug,
                view_count: result.data.view_count ?? p.view_count,
              };
            }
            return p;
          })
        );
      } else {
        console.error("Toggle public failed:", result.message);
      }
    } catch (err) {
      console.error("Toggle public error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  /* ---------- Copy Link Handler ---------- */
  const handleCopyLink = (e, portfolio) => {
    e.stopPropagation();
    const slug = portfolio.public_slug;
    if (!slug) return;

    const publicUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    });
  };

  // ---------------- Loading UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-aurora flex flex-col items-center justify-center text-[var(--neo-text)] font-sans">
        <div className="noise-overlay" />
        <div className="w-10 h-10 border-4 border-accent-color border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--neo-text)] tracking-wider uppercase text-sm font-semibold">
          Loading Your Portfolios...
        </p>
      </div>
    );
  }

  // ---------------- Error UI ----------------
  if (error) {
    return (
      <div className="min-h-screen bg-aurora flex flex-col items-center justify-center text-[var(--neo-text)] px-6 font-sans">
        <div className="noise-overlay" />
        <GlassCard className="max-w-md w-full border-red-500/30 text-center">
          <h3 className="text-xl font-bold font-display text-red-400 mb-2">Oops! Something went wrong</h3>
          <p className="text-[var(--neo-text)] opacity-80 text-sm mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  // ---------------- Main UI ----------------
  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          portfolio={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}

      {/* Custom Link Modal */}
      {customSlugTarget && (
        <CustomSlugModal
          portfolio={customSlugTarget}
          onClose={() => setCustomSlugTarget(null)}
          onSuccess={(newSlug) => {
            const targetId = customSlugTarget._id || customSlugTarget.id;
            setPortfolios((prev) =>
              prev.map((p) =>
                (p._id || p.id) === targetId ? { ...p, public_slug: newSlug } : p
              )
            );
          }}
        />
      )}

      {/* Copy toast */}
      <CopyToast show={showCopyToast} />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-aurora text-[var(--neo-text)] font-sans relative overflow-x-hidden"
      >
        <div className="noise-overlay" />
        
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 relative z-10">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-black/10 dark:border-white/10">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-[var(--neo-text)]">
                My Portfolios
              </h1>
              <p className="opacity-80 text-sm md:text-base mt-2">
                Manage, preview, and share all your generated portfolios.
              </p>
            </div>

            <Button
              onClick={() => navigate('/viewtemplates')}
              variant="primary"
              className="uppercase tracking-wider font-bold  hover:bg-pink-500/20 hover:text-[var(--neo-text)]"
            >
              + Create New
            </Button>
          </div>

          {/* Delete error toast */}
          {deleteError && (
            <div className="mb-6 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-center justify-between">
              <span>⚠ {deleteError}</span>
              <button
                onClick={() => setDeleteError(null)}
                className="ml-4 text-red-400 hover:text-red-300 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Empty State */}
          {portfolios.length === 0 ? (
            <GlassCard className="text-center max-w-2xl mx-auto my-12 py-16">
              <div className="w-16 h-16 bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-xl">
                📂
              </div>
              <h3 className="text-2xl font-display font-bold text-[var(--neo-text)] mb-2">No Portfolios Found</h3>
              <p className="opacity-80 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                You haven't created any portfolios yet. Select a template and provide your details to generate your first live portfolio!
              </p>
              <Button onClick={() => navigate('/viewtemplates')} variant="primary" className="mx-auto block w-fit">
                Browse Templates
              </Button>
            </GlassCard>
          ) : (
            /* Portfolios Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
              {portfolios.map((portfolio) => {
                const fullName = portfolio?.personalInfo?.full_name || portfolio?.full_name || "Untitled Portfolio";
                const title = portfolio?.personalInfo?.main_title || portfolio?.main_title || "Software Developer";
                const templateUsed = portfolio?.templateId || portfolio?.template_id || "template1";
                const createdAt = portfolio?.created_at || portfolio?.createdAt
                  ? new Date(portfolio.created_at || portfolio.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "Recently Created";
                const isPublic = portfolio?.is_public || false;
                const publicSlug = portfolio?.public_slug || null;
                const viewCount = portfolio?.view_count || 0;
                const isToggling = togglingId === (portfolio._id || portfolio.id);

                return (
                  <motion.div
                    key={portfolio._id || portfolio.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)", transition: { duration: 0.3 } }}
                    className="h-full"
                  >
                    <GlassCard
                      onClick={() => handleCardClick(portfolio)}
                      className="h-full group flex flex-col justify-between cursor-pointer hover:border-accent-color/50 transition-colors p-6 sm:p-6"
                    >
                    {/* Top Badge Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 rounded-full text-xs font-bold uppercase tracking-wider">
                            {templateUsed}
                          </span>
                          {/* View count badge */}
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--neo-bg)]/80 border border-zinc-700/50 text-zinc-400 rounded-full text-xs font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {viewCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-zinc-500 font-medium">
                            {createdAt}
                          </span>

                          {/* Job Matcher Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const portfolioId = portfolio._id || portfolio.id;
                              navigate(`/portfolio-matcher/${portfolioId}`);
                            }}
                            title="Job Description Alignment Matcher"
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={(e) => handleEditClick(e, portfolio)}
                            title="Edit portfolio"
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteClick(e, portfolio)}
                            title="Delete portfolio"
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Personal Info Summary */}
                      <h3 className="text-2xl font-bold text-[var(--neo-text)] group-hover:text-fuchsia-400 transition-colors duration-200 line-clamp-1">
                        {fullName}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mt-1 mb-4 line-clamp-1">
                        {title}
                      </p>

                      {/* Public/Private Toggle Section */}
                      <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-[var(--neo-bg)]/50 border border-zinc-700/40 rounded-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {isPublic ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-fuchsia-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 1 1-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-zinc-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-fuchsia-400' : 'text-zinc-500'}`}>
                            {isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Custom Link Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomSlugTarget(portfolio);
                            }}
                            title="Customize Link"
                            className="flex items-center gap-1 px-2.5 py-1 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 text-fuchsia-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Custom Link
                          </button>

                          {/* Copy Link Button (only when public) */}
                          {isPublic && publicSlug && (
                            <button
                              onClick={(e) => handleCopyLink(e, portfolio)}
                              title="Copy public link"
                              className="flex items-center gap-1 px-2.5 py-1 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 text-fuchsia-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
                              </svg>
                              Copy
                            </button>
                          )}

                          {/* Toggle switch */}
                          <button
                            onClick={(e) => handleTogglePublic(e, portfolio)}
                            disabled={isToggling}
                            title={isPublic ? 'Make private' : 'Make public'}
                            className="relative w-10 h-5 rounded-full transition-colors duration-300 disabled:opacity-50"
                            style={{
                              background: isPublic
                                ? 'linear-gradient(135deg, #c026d3, #d946ef)'
                                : 'linear-gradient(135deg, #334155, #475569)',
                            }}
                          >
                            <div
                              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300"
                              style={{
                                left: isPublic ? '22px' : '2px',
                              }}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Public URL display */}
                      {isPublic && publicSlug && (
                        <div
                          className="mb-2 px-3 py-2 bg-fuchsia-500/5 border border-fuchsia-500/20 hover:border-fuchsia-500/40 rounded-lg flex items-center justify-between group/url cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomSlugTarget(portfolio);
                          }}
                          title="Click to customize link"
                        >
                          <div>
                            <p className="text-[10px] text-fuchsia-400/60 font-bold uppercase tracking-widest mb-0.5">Public URL</p>
                            <p className="text-fuchsia-300 text-xs font-mono truncate select-all">
                              {window.location.origin}/p/{publicSlug}
                            </p>
                          </div>
                          <span className="text-[10px] text-fuchsia-400 font-bold opacity-0 group-hover/url:opacity-100 transition-opacity whitespace-nowrap ml-2">
                            Edit ✏
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold opacity-60 group-hover:opacity-100 group-hover:text-[var(--neo-text)] transition">
                      <span>Click to view live &rarr;</span>
                      <span className="bg-white/10 group-hover:bg-accent-color text-[var(--neo-text)] px-3 py-1.5 rounded-lg transition-colors">
                        Open
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          )}

        </div>
      </motion.div>
    </>
  );
};

export default MyPortfolios;
