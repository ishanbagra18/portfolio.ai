import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PersonalInfoForm from '../components/form/PersonalInfoForm';
import AboutForm from '../components/form/AboutForm';
import ProjectsForm from '../components/form/ProjectsForm';
import TechStacksForm from '../components/form/TechStacksForm';
import ExperienceForm from '../components/form/ExperienceForm';
import CertificationsForm from '../components/form/CertificationsForm';
import JDTailorWidget from '../components/JDTailorWidget';

const EMPTY = {
  personalInfo: {
    full_name: '', email_id: '', age: '', address: '', main_title: '',
    college_name: '', course_name: '', specialization_course_name: '',
    about_paragraph: '', github_username: '', leetcode_username: '',
    resume_url: ''
  },
  techStacks:     [{ name: '', category: '' }],
  projects:       [
    { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' },
    { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' }
  ],
  experiences:    [{ role: '', company_name: '', date_of_joining: '', work_description: '' }],
  certifications: [{ certification_name: '', issuing_organization: '', credential_url: '' }]
};

const EditPortfolio = () => {
  const navigate   = useNavigate();
  const { portfolioId } = useParams();

  const [formData,    setFormData]    = useState(EMPTY);
  const [templateId,  setTemplateId]  = useState('template1');
  const [fetching,    setFetching]    = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [fetchError,  setFetchError]  = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [resumeFile,  setResumeFile]  = useState(null);   // uploaded resume File object
  const [resumeUrl,   setResumeUrl]   = useState(null);   // local blob URL for preview

  /* ─── Fetch existing portfolio data ─── */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res   = await fetch(`http://localhost:5000/api/portfolio/${portfolioId}`, {
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

        // Normalise project_tech_stack arrays → comma string for the form inputs
        const normaliseProjects = (arr = []) =>
          arr.map(p => ({
            ...p,
            project_tech_stack: Array.isArray(p.project_tech_stack)
              ? p.project_tech_stack.join(', ')
              : (p.project_tech_stack || '')
          }));

        setFormData({
          personalInfo:   { ...EMPTY.personalInfo, ...(d.personalInfo || {}) },
          techStacks:     d.techStacks?.length     ? d.techStacks     : EMPTY.techStacks,
          projects:       d.projects?.length       ? normaliseProjects(d.projects) : EMPTY.projects,
          experiences:    d.experiences?.length    ? d.experiences    : EMPTY.experiences,
          certifications: d.certifications?.length ? d.certifications : EMPTY.certifications
        });
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
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const arr = prev[field].map((item, i) => i !== index ? item : { ...item, [name]: value });
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, empty) =>
    setFormData(prev => ({ ...prev, [field]: [...prev[field], empty] }));

  const handleGitHubImport = (imported) => {
    const empty = { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' };
    const padded = imported.length >= 2 ? imported : [...imported, ...Array(2 - imported.length).fill({ ...empty })];
    setFormData(prev => ({ ...prev, projects: padded }));
  };

  /* ─── Resume Upload (AI autofill) ─── */
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store file ref + create a local preview URL
    setResumeFile(file);
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);          // cleanup old blob
    setResumeUrl(URL.createObjectURL(file));

    setAiLoading(true);
    setSubmitError(null);

    const fd = new FormData();
    fd.append('resume', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/resume/autofill', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...(result.data.personalInfo || {}), ...(result.data.about || {}) },
          projects:       result.data.projects?.length >= 2  ? result.data.projects  : prev.projects,
          experiences:    result.data.experience?.length     ? result.data.experience : prev.experiences,
          certifications: result.data.certifications?.length ? result.data.certifications : prev.certifications,
          techStacks:     result.data.techStacks?.length     ? result.data.techStacks : prev.techStacks
        }));
      } else {
        setSubmitError(result.error || 'Resume parse karne me problem aayi.');
      }
    } catch (err) {
      setSubmitError(`Could not parse resume: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  /* ─── Submit (PUT) ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const res    = await fetch(`http://localhost:5000/api/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (!res.ok || !result.success)
        throw new Error(result.message || 'Failed to update portfolio.');

      navigate(`/portfolio/${templateId}/${portfolioId}`, { replace: true, state: null });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Loading / Error states ─── */
  if (fetching) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Loading Portfolio Data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 font-sans">
        <div className="max-w-md w-full border border-red-500/30 rounded-2xl p-8 text-center bg-gray-950">
          <h3 className="text-xl font-bold text-red-400 mb-2">Failed to Load</h3>
          <p className="text-gray-400 text-sm mb-6">{fetchError}</p>
          <button onClick={() => navigate('/my-portfolios')}
            className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm">
            ← Back to My Portfolios
          </button>
        </div>
      </div>
    );
  }

  /* ─── Main Form ─── */
  return (
    <div className="min-h-screen bg-black w-full font-sans text-white pb-32">

      {/* Page Header */}
      <div className="py-24 px-6 max-w-6xl mx-auto border-b border-gray-900">
        <div className="mb-4 inline-block px-3 py-1 border border-gray-700 bg-gray-900 text-xs font-mono uppercase tracking-widest text-gray-400">
          Editing Template: <span className="text-white font-bold">{templateId}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Edit Your
        </h1>
        <h2
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-2"
          style={{ WebkitTextStroke: '2px #374151', color: 'transparent' }}
        >
          Portfolio.
        </h2>
      </div>

      {/* AI Resume Auto-Fill */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="p-8 border border-gray-800 rounded-lg bg-gray-950/50 focus-within:border-white transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                Instant Auto-Fill
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                ⚡ Upload Resume With AI
              </h3>
              <p className="text-gray-400 text-sm max-w-md">
                Upload your PDF or DOCX resume — AI will parse and auto-fill all form fields.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <label className="cursor-pointer px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all rounded">
                {aiLoading ? '⏳ Analysing...' : '+ Upload Resume (.PDF / .DOCX)'}
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleResumeUpload}
                  disabled={aiLoading}
                  className="hidden"
                />
              </label>

              {/* Clickable resume pill */}
              {resumeFile && resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Click to open resume"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 hover:border-white rounded-lg text-xs text-gray-300 hover:text-white transition-colors group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="truncate max-w-[180px] font-medium">{resumeFile.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-500 group-hover:text-white shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {submitError && (
            <p className="text-red-500 text-sm mt-4 font-semibold">⚠ {submitError}</p>
          )}
        </div>

        {/* JD Auto-Filler */}
        <div className="mt-8">
          <JDTailorWidget
            currentData={formData}
            onTailored={(tailoredData) => setFormData(tailoredData)}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 w-full mt-12">
        <PersonalInfoForm data={formData.personalInfo} onChange={handlePersonalInfoChange} />
        <AboutForm        data={formData.personalInfo} onChange={handlePersonalInfoChange} />
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

        {submitError && (
          <p className="mt-8 text-red-500 text-sm font-semibold text-right">⚠ {submitError}</p>
        )}

        <div className="mt-24 pt-12 border-t border-gray-900 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/my-portfolios')}
            className="px-8 py-4 border border-gray-700 text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all"
          >
            ← Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-12 py-6 font-black uppercase tracking-widest text-lg transition-colors duration-300 ${
              submitting ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {submitting ? 'Saving Changes...' : 'Save Changes →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPortfolio;
