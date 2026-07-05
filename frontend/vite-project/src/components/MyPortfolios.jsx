import { API_BASE } from '../lib/api';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ---------------- Confirm Delete Modal ---------------- */
const DeleteModal = ({ portfolio, onConfirm, onCancel, isDeleting }) => {
  const fullName = portfolio?.personalInfo?.full_name || portfolio?.full_name || "Untitled Portfolio";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-2xl p-7 shadow-2xl shadow-red-950/40">
        {/* Icon */}
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6 text-red-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white text-center mb-2">
          Delete Portfolio?
        </h3>
        <p className="text-slate-400 text-sm text-center leading-relaxed mb-7">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">"{fullName}"</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Copy Link Toast ---------------- */
const CopyToast = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold rounded-xl backdrop-blur-xl shadow-2xl animate-bounce-in flex items-center gap-2">
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 tracking-wider uppercase text-sm font-semibold">
          Loading Your Portfolios...
        </p>
      </div>
    );
  }

  // ---------------- Error UI ----------------
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6 font-sans">
        <div className="max-w-md w-full bg-slate-900/80 border border-red-500/30 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong</h3>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition text-sm"
          >
            Try Again
          </button>
        </div>
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

      {/* Copy toast */}
      <CopyToast show={showCopyToast} />

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-slate-800/80 pb-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                My Portfolios
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-2">
                Manage, preview, and share all your generated portfolios.
              </p>
            </div>

            <Link
              to="/viewtemplates"
              className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all text-sm uppercase tracking-wider whitespace-nowrap"
            >
              + Create New
            </Link>
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
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto my-12">
              <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                📂
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Portfolios Found</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                You haven't created any portfolios yet. Select a template and provide your details to generate your first live portfolio!
              </p>
              <Link
                to="/viewtemplates"
                className="px-8 py-3.5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition rounded-xl"
              >
                Browse Templates
              </Link>
            </div>
          ) : (
            /* Portfolios Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div
                    key={portfolio._id || portfolio.id}
                    onClick={() => handleCardClick(portfolio)}
                    className="group relative bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/30 hover:-translate-y-1"
                  >
                    {/* Top Badge Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider">
                            {templateUsed}
                          </span>
                          {/* View count badge */}
                          <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 text-slate-400 rounded-full text-xs font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {viewCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500 font-medium">
                            {createdAt}
                          </span>

                          {/* Job Matcher Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const portfolioId = portfolio._id || portfolio.id;
                              navigate(`/job-matcher/${portfolioId}`);
                            }}
                            title="Job Description Alignment Audit"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                          </button>

                          {/* AI Recruiter Critique Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const portfolioId = portfolio._id || portfolio.id;
                              navigate(`/critique/${portfolioId}`);
                            }}
                            title="Hiring Manager AI Critique"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                              strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 9h3.75M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Z" />
                            </svg>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={(e) => handleEditClick(e, portfolio)}
                            title="Edit portfolio"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
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
                            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
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
                      <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors duration-200 line-clamp-1">
                        {fullName}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium mt-1 mb-4 line-clamp-1">
                        {title}
                      </p>

                      {/* Public/Private Toggle Section */}
                      <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-slate-800/50 border border-slate-700/40 rounded-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {isPublic ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-emerald-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 1 1-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-slate-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider ${isPublic ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Copy Link Button (only when public) */}
                          {isPublic && publicSlug && (
                            <button
                              onClick={(e) => handleCopyLink(e, portfolio)}
                              title="Copy public link"
                              className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
                              </svg>
                              Copy Link
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
                                ? 'linear-gradient(135deg, #059669, #10b981)'
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
                        <div className="mb-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg" onClick={(e) => e.stopPropagation()}>
                          <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest mb-1">Public URL</p>
                          <p className="text-emerald-300 text-xs font-mono truncate select-all">
                            {window.location.origin}/p/{publicSlug}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white transition">
                      <span>Click to view live &rarr;</span>
                      <span className="bg-slate-800 group-hover:bg-violet-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                        Open
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MyPortfolios;