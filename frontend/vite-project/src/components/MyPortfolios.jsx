import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ---------------- Confirm Delete Modal ---------------- */
const DeleteModal = ({ portfolio, onConfirm, onCancel, isDeleting }) => {
  const fullName = portfolio?.personalInfo?.full_name || "Untitled Portfolio";

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

/* ---------------- Main Component ---------------- */
const MyPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // portfolio object to delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPortfolios = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        const res = await fetch("http://localhost:5000/api/portfolio/my-portfolios", {
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
      const res = await fetch(`http://localhost:5000/api/portfolio/${portfolioId}`, {
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
                const fullName = portfolio?.personalInfo?.full_name || "Untitled Portfolio";
                const title = portfolio?.personalInfo?.main_title || "Software Developer";
                const templateUsed = portfolio?.templateId || portfolio?.template_id || "template1";
                const createdAt = portfolio?.createdAt
                  ? new Date(portfolio.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  : "Recently Created";

                return (
                  <div
                    key={portfolio._id || portfolio.id}
                    onClick={() => handleCardClick(portfolio)}
                    className="group relative bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/30 hover:-translate-y-1"
                  >
                    {/* Top Badge Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full text-xs font-bold uppercase tracking-wider">
                          {templateUsed}
                        </span>
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
                      <p className="text-slate-400 text-sm font-medium mt-1 mb-6 line-clamp-1">
                        {title}
                      </p>
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