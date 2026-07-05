import React, { useState } from 'react';

/* ── GitHub icon SVG ── */
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

/* ── Spinner ── */
const Spinner = () => (
  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
);

import { API_BASE } from '../../lib/api';

const ProjectsForm = ({ data, onChange, onAdd, onGitHubImport, githubUsername }) => {
  const [importing, setImporting]   = useState(false);
  const [ghError, setGhError]       = useState('');
  const [username, setUsername]     = useState(githubUsername || '');
  const [showInput, setShowInput]   = useState(false);
  const [polishingIndex, setPolishingIndex] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleMediaUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingIndex(index);
    const fd = new FormData();
    fd.append('media', file);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/portfolio/upload-media`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: fd
      });

      const result = await res.json();
      if (res.ok && result.success && result.url) {
        onChange(index, { target: { name: 'project_image', value: result.url } });
      } else {
        alert(result.message || 'Media upload failed.');
      }
    } catch (error) {
      console.error('Media upload error:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handlePolishProject = async (index, currentText) => {
    if (!currentText || !currentText.trim()) {
      alert("Please write something in the project description first before polishing.");
      return;
    }

    setPolishingIndex(index);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/ai/polish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ text: currentText, type: "project" }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        onChange(index, { target: { name: "project_desc", value: result.polishedText } });
      } else {
        alert(result.message || "Failed to polish project description.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI service.");
    } finally {
      setPolishingIndex(null);
    }
  };

  const handleImport = async () => {
    const user = username.trim();
    if (!user) {
      setGhError('Please enter a GitHub username.');
      return;
    }

    setImporting(true);
    setGhError('');

    try {
      // Fetch all public repos, sorted by pushed_at (most recently active first)
      const res = await fetch(
        `https://api.github.com/users/${user}/repos?sort=pushed&direction=desc&per_page=100`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );

      if (res.status === 404) {
        setGhError(`GitHub user "${user}" not found.`);
        setImporting(false);
        return;
      }
      if (!res.ok) {
        const limit = res.headers.get('X-RateLimit-Remaining');
        if (limit === '0') {
          setGhError('GitHub API rate limit exceeded. Try again in a minute.');
        } else {
          setGhError(`GitHub API error (${res.status}). Please try again.`);
        }
        setImporting(false);
        return;
      }

      const repos = await res.json();

      // Filter: not forks, not archived, has a name — take top 3
      const filtered = repos
        .filter(r => !r.fork && !r.archived && r.name)
        .slice(0, 3);

      if (filtered.length === 0) {
        setGhError('No suitable public repositories found for this user.');
        setImporting(false);
        return;
      }

      // Map to ProjectsForm data shape
      const importedProjects = filtered.map(repo => ({
        project_name:       repo.name,
        project_desc:       repo.description || '',
        project_tech_stack: repo.language || '',
        project_github_link: repo.html_url
      }));

      onGitHubImport(importedProjects);
      setShowInput(false);
      setGhError('');
    } catch (err) {
      setGhError('Network error. Check your connection and try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <section className="py-20 border-b border-gray-900">

      {/* Section header */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <span
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          02
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Projects
        </h3>
      </div>

      {/* ── GitHub Import Banner ── */}
      <div className="mb-14 p-6 border border-gray-800 rounded-lg bg-gray-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              Quick Import
            </p>
            <p className="text-white font-semibold text-sm">
              Fetch your top repositories directly from GitHub
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Pulls repo name, language, description & URL — top 6 non-fork repos
            </p>
          </div>

          {!showInput ? (
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all whitespace-nowrap rounded"
            >
              <GitHubIcon />
              Import from GitHub
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setGhError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleImport()}
                placeholder="GitHub username"
                autoFocus
                className="bg-transparent border border-gray-700 focus:border-white text-white text-sm px-4 py-2.5 rounded w-full sm:w-48 focus:outline-none transition-colors placeholder:text-gray-600"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 disabled:opacity-60 transition-all rounded whitespace-nowrap"
                >
                  {importing ? <><Spinner /> Fetching...</> : <><GitHubIcon />Fetch Repos</>}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowInput(false); setGhError(''); }}
                  className="px-3 py-2.5 border border-gray-700 text-gray-400 hover:text-white hover:border-white text-xs font-bold uppercase tracking-widest transition-all rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {ghError && (
          <p className="mt-3 text-red-400 text-xs font-semibold flex items-center gap-1.5">
            <span>⚠</span> {ghError}
          </p>
        )}
      </div>

      {/* ── Project cards ── */}
      <div className="space-y-16">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-8 border border-gray-800 rounded-lg relative group focus-within:border-white transition-colors"
          >
            <div className="absolute -top-4 left-6 bg-black px-4 text-sm font-bold text-gray-500 tracking-widest">
              PROJECT {index + 1}
              {index < 2 && (
                <span className="ml-2 text-red-500 text-xs">* required</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={project.project_name ?? ''}
                  onChange={(e) => onChange(index, e)}
                  placeholder="e.g. GeetHub"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  name="project_tech_stack"
                  value={project.project_tech_stack ?? ''}
                  onChange={(e) => onChange(index, e)}
                  placeholder="React, Go, Gin, MongoDB"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  GitHub Link
                </label>
                <input
                  type="url"
                  name="project_github_link"
                  value={project.project_github_link ?? ''}
                  onChange={(e) => onChange(index, e)}
                  placeholder="https://github.com/username/repo"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePolishProject(index, project.project_desc)}
                    disabled={polishingIndex !== null}
                    className="text-[10px] font-bold text-violet-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {polishingIndex === index ? (
                      <>
                        <Spinner /> Polishing...
                      </>
                    ) : (
                      "✨ Polish with AI"
                    )}
                  </button>
                </div>
                <textarea
                  name="project_desc"
                  value={project.project_desc ?? ''}
                  onChange={(e) => onChange(index, e)}
                  placeholder="What does this project do?"
                  rows="2"
                  className="bg-transparent border-b border-gray-800 text-lg text-white py-2 focus:outline-none focus:border-white transition-colors resize-none mb-6"
                />
              </div>

              {/* Project Media Upload field */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                  Project Image / Media (Screenshot/Demo video)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-5 py-2.5 border border-gray-700 bg-gray-900 text-gray-300 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:border-white transition-all rounded">
                    {uploadingIndex === index ? '⏳ Uploading...' : '+ Choose Media File'}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleMediaUpload(index, e)}
                      disabled={uploadingIndex !== null}
                      className="hidden"
                    />
                  </label>
                  {project.project_image ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 truncate max-w-[200px] font-mono">
                        {project.project_image.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChange(index, { target: { name: 'project_image', value: '' } })}
                        className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600 font-medium">No media file uploaded</span>
                  )}
                </div>
                {project.project_image && (
                  <div className="mt-4 max-w-[320px] border border-gray-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-lg">
                    {project.project_image.match(/\.(mp4|webm|ogg)$/i) || project.project_image.includes('video-') ? (
                      <video src={project.project_image} controls className="w-full h-auto object-cover max-h-48" />
                    ) : (
                      <img src={project.project_image} alt="Preview" className="w-full h-auto object-cover max-h-48" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-10 px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all"
      >
        + Add Another Project
      </button>

    </section>
  );
};

export default ProjectsForm;