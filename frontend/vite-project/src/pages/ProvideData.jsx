import { API_BASE, fetchWithFallback } from '../lib/api';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PersonalInfoForm from '../components/form/PersonalInfoForm';
import AboutForm from '../components/form/AboutForm';
import ProjectsForm from '../components/form/ProjectsForm';
import TechStacksForm from '../components/form/TechStacksForm';
import ExperienceForm from '../components/form/ExperienceForm';
import CertificationsForm from '../components/form/CertificationsForm';
import DynamicSectionForm from '../components/form/DynamicSectionForm';
import JDTailorWidget from '../components/JDTailorWidget';
import { SECTION_SCHEMAS } from '../lib/sectionSchemas';

const ProvideData = () => {
  const navigate = useNavigate();
  const { templateId: paramTemplateId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Teeno jagah se check karo taaki ID kabhi miss na ho
  const resolvedTemplateId = paramTemplateId || location.state?.templateId || queryParams.get('template') || queryParams.get('templateId') || 'template1';

  // States for loaders and errors
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);   // uploaded File object
  const [resumeUrl, setResumeUrl] = useState(null);   // local blob URL for preview

  const [formData, setFormData] = useState({
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
      currently_learning: [],
      interests: []
    },
    techStacks: [
      { name: '', category: '' }
    ],
    projects: [
      { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' },
      { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' } // Minimum 2 required
    ],
    experiences: [
      { role: '', company_name: '', date_of_joining: '', work_description: '' }
    ],
    certifications: [
      { certification_name: '', issuing_organization: '', credential_url: '' }
    ]
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  // ✅ FIXED: Ab immutable update ho raha hai (purane objects mutate nahi hote)
  // ✅ FIXED: project_tech_stack ab typing ke waqt string hi rehta hai, array me convert nahi hota
  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedArray = prev[field].map((item, i) => {
        if (i !== index) return item;
        return { ...item, [name]: value };
      });
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayItem = (field, emptyObject) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], emptyObject]
    }));
  };

  const handleDynamicSectionChange = (sectionKey, index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
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
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [sectionKey]: [...(prev.personalInfo[sectionKey] || []), emptyObject]
      }
    }));
  };

  // GitHub Import: replace projects array with fetched repos
  const handleGitHubImport = (importedProjects) => {
    const emptyProject = { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' };
    // Ensure minimum 2 projects (pad if needed)
    const padded = importedProjects.length >= 2
      ? importedProjects
      : [...importedProjects, ...Array(2 - importedProjects.length).fill({ ...emptyProject })];
    setFormData(prev => ({ ...prev, projects: padded }));
  };

  // AI Resume Parse Function
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store file + create local preview URL
    setResumeFile(file);
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    setResumeUrl(URL.createObjectURL(file));

    setLoading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('resume', file);

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetchWithFallback('/api/resume/autofill', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: uploadData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || `Server error (${response.status})`);
      }

      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...(result.data.personalInfo || {}),
          ...(result.data.about || {})
        },
        projects: result.data.projects?.length >= 2 ? result.data.projects : prev.projects,
        experiences: result.data.experience?.length ? result.data.experience : prev.experiences,
        certifications: result.data.certifications?.length ? result.data.certifications : prev.certifications,
        techStacks: result.data.techStacks?.length ? result.data.techStacks : prev.techStacks
      }));
    } catch (err) {
      console.error('Upload Error Details:', err);
      setError(`Server se connect nahi ho paya (${err.message}).`);
    } finally {
      setLoading(false);
    }
  };

  // Database Save + Redirect Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Aap login nahi hain. Pehle login karke dobara try karein.');
      }

      // ✅ FIXED: Submit karte waqt project_tech_stack string ko array me convert kar rahe hain
      const cleanedProjects = formData.projects.map(proj => ({
        ...proj,
        project_tech_stack: typeof proj.project_tech_stack === 'string'
          ? proj.project_tech_stack.split(',').map(item => item.trim()).filter(Boolean)
          : proj.project_tech_stack
      }));

      const payloadData = {
        ...formData,
        projects: cleanedProjects,
        personalInfo: {
          ...formData.personalInfo,
          template_id: resolvedTemplateId,
          templateId: resolvedTemplateId
        },
        templateId: resolvedTemplateId,
        template_id: resolvedTemplateId
      };

      const response = await fetchWithFallback('/api/portfolio/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payloadData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Portfolio save karne me error aayi.');
      }

      const { portfolioId } = result;
      navigate(`/portfolio/${resolvedTemplateId}/${portfolioId}`, { state: formData });

    } catch (err) {
      console.error("Submit Error:", err);
      alert(err.message);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--neo-bg)] w-full font-sans text-[var(--neo-text)] pb-32 relative overflow-x-hidden">

      <div className="py-12 sm:py-24 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
        <div className="mb-4 inline-block px-3 py-1 border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 rounded-lg">
          Selected Template: <span className="text-pink-600 dark:text-pink-400 font-bold">{resolvedTemplateId}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
          Build Your
        </h1>
        <h2 className="text-3.5xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Portfolio.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 mt-8 sm:mt-12">
        <div className="p-5 sm:p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/80 dark:bg-zinc-900/50 shadow-xl focus-within:border-pink-500 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 block">Instant Auto-Fill</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-1">
                ⚡ Upload Resume With AI
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md">
                Upload your PDF or DOCX resume. Our AI parses data to auto-fill all form fields below.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 w-full sm:w-auto">
              <label className="cursor-pointer px-5 sm:px-8 py-3.5 sm:py-4 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all text-center w-full sm:w-auto rounded-xl shadow-md">
                {loading ? 'AI Resume Parsing...' : '+ Upload Resume (.PDF / .DOCX)'}
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleResumeUpload}
                  disabled={loading}
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
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-pink-500 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:text-pink-600 transition-colors group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-zinc-500 group-hover:text-pink-600 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="truncate max-w-[180px] font-medium">{resumeFile.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-zinc-500 group-hover:text-pink-600 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 font-semibold">⚠ {error}</p>}
        </div>

        {/* JD Auto-Filler */}
        <div className="mt-8">
          <JDTailorWidget
            currentData={formData}
            onTailored={(tailoredData) => setFormData(tailoredData)}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 w-full mt-12">
        <PersonalInfoForm data={formData.personalInfo} onChange={handlePersonalInfoChange} />
        <AboutForm data={formData.personalInfo} onChange={handlePersonalInfoChange} />
        <ProjectsForm
          data={formData.projects}
          onChange={(index, e) => handleArrayChange('projects', index, e)}
          onAdd={() => addArrayItem('projects', { project_name: '', project_desc: '', project_tech_stack: '', project_github_link: '' })}
          onGitHubImport={handleGitHubImport}
          githubUsername={formData.personalInfo.github_username}
        />
        <TechStacksForm data={formData.techStacks} onChange={(index, e) => handleArrayChange('techStacks', index, e)} onAdd={() => addArrayItem('techStacks', { name: '', category: '' })} />
        <ExperienceForm data={formData.experiences} onChange={(index, e) => handleArrayChange('experiences', index, e)} onAdd={() => addArrayItem('experiences', { role: '', company_name: '', date_of_joining: '', work_description: '' })} />
        <CertificationsForm data={formData.certifications} onChange={(index, e) => handleArrayChange('certifications', index, e)} onAdd={() => addArrayItem('certifications', { certification_name: '', issuing_organization: '', credential_url: '' })} />

        {/* Render New Dynamic Sections */}
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

        <div className="mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-12 py-5 font-black uppercase tracking-widest text-base sm:text-lg rounded-2xl transition-all shadow-xl cursor-pointer ${submitting ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white shadow-pink-500/25 active:scale-95'
              }`}
          >
            {submitting ? 'Saving To Database...' : 'Generate Portfolio →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProvideData;