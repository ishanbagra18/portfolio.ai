import { API_BASE } from '../lib/api';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PersonalInfoForm from '../components/form/PersonalInfoForm';
import AboutForm from '../components/form/AboutForm';
import ProjectsForm from '../components/form/ProjectsForm';
import TechStacksForm from '../components/form/TechStacksForm';
import ExperienceForm from '../components/form/ExperienceForm';
import CertificationsForm from '../components/form/CertificationsForm';
import DynamicSectionForm from '../components/form/DynamicSectionForm';
import JDTailorWidget from '../components/JDTailorWidget';
import SectionOrderCustomizer from '../components/SectionOrderCustomizer';
import ThemeCustomizerPanel from '../components/ThemeCustomizerPanel';
import VersionHistoryModal from '../components/VersionHistoryModal';
import PrivateLinkModal from '../components/PrivateLinkModal';
import LiveTemplatePreview from '../components/LiveTemplatePreview';
import RecruiterChangelog from '../components/RecruiterChangelog';
import ShareModal from '../components/ShareModal';
import { toast } from 'sonner';
import { SECTION_SCHEMAS } from '../lib/sectionSchemas';
import { ArrowLeft, Undo2, Redo2, Columns, Eye, Edit3, Palette, Layers, History, ShieldCheck, LayoutGrid, Share2, Sparkles } from 'lucide-react';

const ALL_TEMPLATES = [
  { id: 'template1', name: 'Neon Dark' },
  { id: 'template2', name: 'Bold Minimal' },
  { id: 'template3', name: 'White Elegance' },
  { id: 'template4', name: 'Blueprint Technical' },
  { id: 'template5', name: 'Neo Brutalist' },
  { id: 'template6', name: 'Editorial Gallery' },
  { id: 'template7', name: 'Aurora Glass' },
  { id: 'template8', name: 'Cyberpunk Hacker' },
  { id: 'template9', name: 'Retro CRT' },
  { id: 'template10', name: 'Sage Botanical' },
  { id: 'template11', name: 'Newspaper Chronicles' },
  { id: 'template12', name: 'Swiss Constructivist' },
  { id: 'template13', name: '8-Bit Arcade' },
  { id: 'template14', name: 'Tactical HUD' },
  { id: 'template15', name: 'Soft Claymorphism' },
  { id: 'template16', name: 'Vaporwave Synth' },
  { id: 'template17', name: 'Minimalist Monolith' },
  { id: 'template18', name: 'Nordic Light' },
  { id: 'template19', name: 'Terminal Matrix' },
  { id: 'template20', name: 'Luxury Gold Velvet' }
];

const EMPTY = {
  personalInfo: {
    full_name: '', email_id: '', age: '', address: '', main_title: '',
    college_name: '', course_name: '', specialization_course_name: '',
    about_paragraph: '', github_username: '', leetcode_username: '',
    resume_url: '',
    achievements_data: [],
    publications_data: [],
    hackathons_data: [],
    open_source_data: [],
    volunteering_data: [],
    research_data: [],
    education_data: [],
    awards_data: [],
    testimonials_data: [],
    blog_posts: [],
    case_studies: [],
    currently_learning: [],
    interests: [],
    section_order: ['about', 'projects', 'experiences', 'tech_stacks', 'certifications', 'blog_posts', 'case_studies', 'testimonials_data'],
    section_visibility: {},
    theme_settings: { primaryColor: '#ec4899', fontFamily: 'sans', bgMode: 'dark' }
  },
  techStacks: [{ name: '', category: '' }],
  projects: [
    { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' },
    { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' }
  ],
  experiences: [{ role: '', company_name: '', date_of_joining: '', work_description: '' }],
  certifications: [{ certification_name: '', issuing_organization: '', credential_url: '' }]
};

const EditPortfolio = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams();

  const [formData, setFormData] = useState(EMPTY);
  const [templateId, setTemplateId] = useState('template1');
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  // New Feature Controls State
  const [viewMode, setViewMode] = useState('split'); // 'form' | 'split' | 'preview'
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'reorder' | 'theme'
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showChangelogModal, setShowChangelogModal] = useState(false);

  // Client-Side Undo / Redo History Stack
  const [history, setHistory] = useState([EMPTY]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushStateToHistory = useCallback((newState) => {
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(newState);
      return next.slice(-20); // Limit to last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const updateFormData = (updater) => {
    setFormData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      pushStateToHistory(next);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setFormData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setFormData(history[historyIndex + 1]);
    }
  };

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  /* ─── Fetch existing portfolio data ─── */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          setFetchError(result.message || 'Failed to load portfolio.');
          return;
        }

        const d = result.data;
        const tid = d.templateId || d.template_id || 'template1';
        setTemplateId(tid);

        const normaliseProjects = (arr = []) =>
          arr.map(p => ({
            ...p,
            project_tech_stack: Array.isArray(p.project_tech_stack)
              ? p.project_tech_stack.join(', ')
              : (p.project_tech_stack || '')
          }));

        const initialForm = {
          personalInfo: { ...EMPTY.personalInfo, ...(d.personalInfo || {}) },
          techStacks: d.techStacks?.length ? d.techStacks : EMPTY.techStacks,
          projects: d.projects?.length ? normaliseProjects(d.projects) : EMPTY.projects,
          experiences: d.experiences?.length ? d.experiences : EMPTY.experiences,
          certifications: d.certifications?.length ? d.certifications : EMPTY.certifications
        };

        setFormData(initialForm);
        setHistory([initialForm]);
        setHistoryIndex(0);
      } catch (err) {
        setFetchError('Could not connect to the server.');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [portfolioId]);

  /* ─── Handlers ─── */
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target;
    updateFormData(prev => {
      const arr = prev[field].map((item, i) => i !== index ? item : { ...item, [name]: value });
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, empty) =>
    updateFormData(prev => ({ ...prev, [field]: [...prev[field], empty] }));

  const handleDynamicSectionChange = (sectionKey, index, e) => {
    const { name, value } = e.target;
    updateFormData(prev => {
      const updatedArray = [...(prev.personalInfo[sectionKey] || [])];
      updatedArray[index] = { ...updatedArray[index], [name]: value };
      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [sectionKey]: updatedArray
        }
      };
    });
  };

  const addDynamicSectionItem = (sectionKey, emptyObject) => {
    updateFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [sectionKey]: [...(prev.personalInfo[sectionKey] || []), emptyObject]
      }
    }));
  };

  const handleGitHubImport = (imported) => {
    const empty = { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' };
    const padded = imported.length >= 2 ? imported : [...imported, ...Array(2 - imported.length).fill({ ...empty })];
    updateFormData(prev => ({ ...prev, projects: padded }));
  };

  /* ─── Resume Upload (AI autofill) ─── */
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    setResumeUrl(URL.createObjectURL(file));

    setAiLoading(true);
    setSubmitError(null);

    const fd = new FormData();
    fd.append('resume', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/resume/autofill`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      if (result.success) {
        updateFormData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...(result.data.personalInfo || {}), ...(result.data.about || {}) },
          projects: result.data.projects?.length >= 2 ? result.data.projects : prev.projects,
          experiences: result.data.experience?.length ? result.data.experience : prev.experiences,
          certifications: result.data.certifications?.length ? result.data.certifications : prev.certifications,
          techStacks: result.data.techStacks?.length ? result.data.techStacks : prev.techStacks
        }));
      } else {
        setSubmitError(result.error || 'Resume parse error.');
      }
    } catch (err) {
      setSubmitError(`Could not parse resume: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  /* ─── Submit (PUT / POST) ─── */
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('You are not logged in.');

      const cleanedProjects = formData.projects.map(proj => ({
        ...proj,
        project_tech_stack: typeof proj.project_tech_stack === 'string'
          ? proj.project_tech_stack.split(',').map(s => s.trim()).filter(Boolean)
          : proj.project_tech_stack
      }));

      const payload = {
        ...formData,
        projects: cleanedProjects,
        personalInfo: { ...formData.personalInfo, template_id: templateId, templateId },
        templateId,
        template_id: templateId
      };

      const isUpdate = Boolean(portfolioId && portfolioId !== 'undefined' && portfolioId !== 'new');
      const url = isUpdate ? `${API_BASE}/api/portfolio/${portfolioId}` : `${API_BASE}/api/portfolio/create`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (!res.ok || !result.success)
        throw new Error(result.message || 'Failed to save portfolio.');

      toast.success('Portfolio saved successfully!');
      navigate('/my-portfolios', { replace: true });
    } catch (err) {
      setSubmitError(err.message);
      toast.error(err.message || 'Failed to save portfolio');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 uppercase tracking-widest text-sm font-semibold">Loading Studio Editor...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-6 font-sans">
        <div className="max-w-md w-full border border-red-500/30 rounded-2xl p-8 text-center bg-zinc-900">
          <h3 className="text-xl font-bold text-red-400 mb-2">Failed to Load</h3>
          <p className="text-zinc-400 text-sm mb-6">{fetchError}</p>
          <button onClick={() => navigate('/my-portfolios')}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm">
            ← Back to My Portfolios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-x-hidden">
      {/* Top Studio Header Control Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 pl-4 sm:pl-8 lg:pl-10 pr-6 sm:pr-10 lg:pr-14 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none shadow-2xl">
        {/* Left Cluster: Template Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 py-1.5 shadow-inner">
            <LayoutGrid className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 hidden xl:inline">Template:</span>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[190px] truncate"
            >
              {ALL_TEMPLATES.map(t => (
                <option key={t.id} value={t.id} className="bg-zinc-900 text-white">
                  {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Cluster: Action Tools & Modals */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-25 transition"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white disabled:opacity-25 transition"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-white/10 hidden lg:block" />

          {/* Versions */}
          <button
            type="button"
            onClick={() => setShowVersionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-pink-500/40 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow-sm"
            title="Version History & Snapshots"
          >
            <History className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Versions</span>
          </button>

          {/* Privacy Link */}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-indigo-500/40 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow-sm"
            title="Recruiter Privacy & Passcode"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Privacy Link</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-pink-500/40 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow-sm"
            title="Share Portfolio Link & QR Code"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Recruiter Changelog */}
          <button
            type="button"
            onClick={() => setShowChangelogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-pink-500/40 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow-sm"
            title="Recruiter Activity & Changelog"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Changelog</span>
          </button>
        </div>

        {/* Right Cluster: View Mode & CTA */}
        <div className="flex items-center gap-2.5 shrink-0 mr-2 sm:mr-4">
          {/* View Mode Segmented Controls */}
          <div className="flex bg-zinc-900 border border-white/10 p-0.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${viewMode === 'form' ? 'bg-pink-500 text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              <Edit3 className="w-3.5 h-3.5" /> <span className="hidden md:inline">Form</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${viewMode === 'split' ? 'bg-pink-500 text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              <Columns className="w-3.5 h-3.5" /> <span className="hidden md:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition ${viewMode === 'preview' ? 'bg-pink-500 text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5" /> <span className="hidden md:inline">Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/20 transition hover:scale-[1.02] active:scale-95 text-white flex items-center gap-1.5 mr-2"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save &amp; Publish →</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Studio Body (Form / Split / Preview View Modes) */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        {/* Left Form Panel (Visible in 'form' or 'split') */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-all ${viewMode === 'preview' ? 'hidden' : viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-white/10' : 'w-full max-w-5xl mx-auto'}`}>
          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'content' ? 'bg-white/10 text-pink-400 border border-pink-500/30' : 'text-zinc-400 hover:text-white'}`}
            >
              <Edit3 className="w-4 h-4" /> Content & Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reorder')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'reorder' ? 'bg-white/10 text-indigo-400 border border-indigo-500/30' : 'text-zinc-400 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> Section Reorder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'theme' ? 'bg-white/10 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-white'}`}
            >
              <Palette className="w-4 h-4" /> Theme Customizer
            </button>
          </div>

          {activeTab === 'reorder' && (
            <SectionOrderCustomizer
              sectionOrder={formData?.personalInfo?.section_order || []}
              sectionVisibility={formData?.personalInfo?.section_visibility || {}}
              onOrderChange={(newOrder) => updateFormData(prev => ({
                ...prev,
                personalInfo: { ...(prev.personalInfo || {}), section_order: newOrder }
              }))}
              onVisibilityToggle={(sectionId, isVisible) => updateFormData(prev => ({
                ...prev,
                personalInfo: {
                  ...(prev.personalInfo || {}),
                  section_visibility: { ...(prev?.personalInfo?.section_visibility || {}), [sectionId]: isVisible }
                }
              }))}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeCustomizerPanel
              themeSettings={formData?.personalInfo?.theme_settings || {}}
              onChange={(newTheme) => updateFormData(prev => ({
                ...prev,
                personalInfo: { ...(prev.personalInfo || {}), theme_settings: newTheme }
              }))}
            />
          )}

          {activeTab === 'content' && (
            <div>
              {/* AI Resume Upload & JD Tailor */}
              <div className="mb-8 p-6 bg-zinc-900 border border-white/10 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">⚡ AI Resume Auto-Fill</h3>
                    <p className="text-xs text-zinc-400">Upload PDF/DOCX to populate fields automatically.</p>
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition text-center">
                    {aiLoading ? 'Analysing...' : '+ Upload Resume'}
                    <input type="file" accept=".pdf,.docx,.doc" onChange={handleResumeUpload} disabled={aiLoading} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <JDTailorWidget currentData={formData} onTailored={(data) => updateFormData(data)} />
              </div>

              {/* Form Sections */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <PersonalInfoForm data={formData.personalInfo} onChange={handlePersonalInfoChange} />
                <AboutForm data={formData.personalInfo} onChange={handlePersonalInfoChange} />
                <ProjectsForm
                  data={formData.projects}
                  onChange={(i, e) => handleArrayChange('projects', i, e)}
                  onAdd={() => addArrayItem('projects', { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' })}
                  onGitHubImport={handleGitHubImport}
                  githubUsername={formData.personalInfo.github_username}
                />
                <TechStacksForm
                  data={formData.techStacks}
                  onChange={(i, e) => handleArrayChange('techStacks', i, e)}
                  onAdd={() => addArrayItem('techStacks', { name: '', category: '' })}
                />
                <ExperienceForm
                  data={formData.experiences}
                  onChange={(i, e) => handleArrayChange('experiences', i, e)}
                  onAdd={() => addArrayItem('experiences', { role: '', company_name: '', date_of_joining: '', work_description: '' })}
                />
                <CertificationsForm
                  data={formData.certifications}
                  onChange={(i, e) => handleArrayChange('certifications', i, e)}
                  onAdd={() => addArrayItem('certifications', { certification_name: '', issuing_organization: '', credential_url: '' })}
                />

                {/* Extended Dynamic Sections (Blog, Case Studies, Testimonials) */}
                {Object.entries(SECTION_SCHEMAS).map(([key, schema], i) => (
                  <DynamicSectionForm
                    key={key}
                    sectionIndex={`0${i + 6}`.slice(-2)}
                    title={schema.title}
                    itemLabel={schema.itemLabel}
                    fields={schema.fields}
                    data={formData.personalInfo[key] || []}
                    onChange={(index, e) => handleDynamicSectionChange(key, index, e)}
                    onAdd={() => addDynamicSectionItem(key, schema.emptyState)}
                  />
                ))}

                {submitError && <p className="text-red-400 text-sm font-semibold">⚠ {submitError}</p>}
              </form>
            </div>
          )}
        </div>

        {/* Right Live Preview Panel (Visible in 'split' or 'preview') */}
        <div className={`p-4 transition-all ${viewMode === 'form' ? 'hidden' : viewMode === 'split' ? 'w-full lg:w-1/2 h-[calc(100vh-60px)] sticky top-[60px]' : 'w-full max-w-6xl mx-auto h-[calc(100vh-60px)]'}`}>
          <LiveTemplatePreview templateId={templateId} formData={formData} />
        </div>
      </div>

      {/* Modals */}
      <VersionHistoryModal
        portfolioId={portfolioId}
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        onRestore={(restoredData) => updateFormData(restoredData)}
      />

      <PrivateLinkModal
        portfolioId={portfolioId}
        personalInfo={formData.personalInfo}
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onUpdate={(updatedInfo) => updateFormData(prev => ({ ...prev, personalInfo: updatedInfo }))}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        candidateName={formData?.personalInfo?.full_name || 'Developer'}
      />

      <RecruiterChangelog
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        candidateName={formData?.personalInfo?.full_name || 'Developer'}
        editable={true}
      />
    </div>
  );
};

export default EditPortfolio;
