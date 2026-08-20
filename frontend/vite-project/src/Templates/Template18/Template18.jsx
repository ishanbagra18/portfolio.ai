import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DynamicSection from './components/DynamicSection';
import ChatbotWidget from '../../components/ChatbotWidget';
import { API_BASE } from '../../lib/api';
import { SECTION_SCHEMAS } from '../../lib/sectionSchemas';

const defaultData = {
  personalInfo: {
    full_name: "Freja Lindqvist",
    email_id: "freja.l@nordicstudio.se",
    main_title: "Product Designer & Frontend Engineer",
    college_name: "KTH Royal Institute of Technology",
    course_name: "B.Sc.",
    specialization_course_name: "Human-Computer Interaction",
    about_paragraph: "Crafting serene, human-centered digital experiences with minimalist Scandinavian design principles, high accessibility standards, and clean code.",
    github_username: "frejalindqvist",
    leetcode_username: "freja_l"
  },
  techStacks: [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "Figma", category: "Design" },
    { name: "TailwindCSS", category: "Styling" },
    { name: "TypeScript", category: "Language" },
    { name: "GraphQL", category: "API" }
  ],
  projects: [
    {
      project_name: "Fjord Design System",
      project_desc: "An accessible, themeable UI component library designed for healthcare and educational web platforms.",
      project_tech_stack: ["React", "TypeScript", "TailwindCSS"],
      project_github_link: "https://github.com"
    },
    {
      project_name: "Lagom Habit Tracker",
      project_desc: "A minimal iOS & Web daily mindfulness journal focused on quiet interactions and zero notification fatigue.",
      project_tech_stack: ["Next.js", "GraphQL", "TailwindCSS"],
      project_github_link: "https://github.com"
    }
  ],
  experiences: [
    {
      role: "Lead Product Engineer",
      company_name: "Nordic Digital Studio",
      date_of_joining: "2023-08-01",
      work_description: "Led user research, wireframing, and frontend component engineering for European e-commerce brands."
    }
  ],
  certifications: [
    {
      certification_name: "UX Research & Accessibility Specialist",
      issuing_organization: "Design Institute Stockholm",
      credential_url: "https://example.com"
    }
  ]
};

const Template18 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    if (publicData) {
      setPortfolioData(publicData);
      setLoading(false);
      return;
    }
    if (portfolioId) {
      const fetchPortfolio = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const res = await fetch(`${API_BASE}/api/portfolio/${portfolioId}`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          const result = await res.json();
          if (result.success && result.data) {
            setPortfolioData(result.data);
          } else if (!location.state) {
            setPortfolioData(defaultData);
          }
        } catch (error) {
          console.error("Error fetching portfolio data:", error);
          if (!location.state) {
            setPortfolioData(defaultData);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchPortfolio();
    } else if (location.state) {
      setPortfolioData(location.state);
      setLoading(false);
    } else {
      setPortfolioData(defaultData);
      setLoading(false);
    }
  }, [portfolioId, publicData, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center text-[#2A2927] font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#78756F] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-xs uppercase font-bold">Loading Nordic Minimalist...</p>
        </div>
      </div>
    );
  }

  const data = portfolioData || defaultData;
  const pInfo = data.personalInfo || {};
  const tStacks = data.techStacks || [];
  const projs = data.projects || [];
  const exps = data.experiences || [];
  const certs = data.certifications || [];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2A2927] font-sans p-6 sm:p-12 relative overflow-x-hidden selection:bg-[#E5E0D8] selection:text-[#2A2927] pb-24">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#E5E0D8] text-[#2A2927] py-2 text-center text-xs font-serif uppercase tracking-widest rounded-xl mb-8 border border-[#D5CF04]/20">
          🌿 Nordic Minimalist Light Preview Mode
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-[#E5E0D8]">
          <span className="text-xl font-serif font-bold tracking-tight text-[#1F2937]">
            {pInfo.full_name || 'Freja Lindqvist'}
          </span>
          <div className="flex gap-6 text-xs uppercase tracking-wider text-[#78756F] font-semibold">
            {pInfo.github_username && (
              <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="hover:text-[#1F2937] transition-colors">GitHub</a>
            )}
            {pInfo.leetcode_username && (
              <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="hover:text-[#1F2937] transition-colors">LeetCode</a>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="p-8 sm:p-14 border border-[#E5E0D8] rounded-3xl bg-white shadow-sm space-y-6">
          <div className="inline-block px-3 py-1 bg-[#F6F4EF] border border-[#E5E0D8] text-[#78756F] text-xs font-serif uppercase tracking-widest rounded-full">
            SCANDINAVIAN DESIGN & ENGINEERING
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#1F2937] leading-none">
            {pInfo.full_name}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#55524D]">
            {pInfo.main_title}
          </p>
          <p className="text-[#55524D] max-w-2xl text-base leading-relaxed">
            {pInfo.about_paragraph}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E5E0D8]">
            {pInfo.resume_url && (
              <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-6 py-3 bg-[#1F2937] hover:bg-[#374151] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm">
                View Résumé
              </a>
            )}
            <a href={`mailto:${pInfo.email_id}`} className="px-6 py-3 border border-[#E5E0D8] hover:bg-[#F6F4EF] text-[#1F2937] font-semibold text-xs uppercase tracking-widest rounded-xl transition-all">
              Send Email &rarr;
            </a>
          </div>
        </section>

        {/* Tech Stack */}
        {tStacks.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#1F2937]">
              Craft & Capabilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {tStacks.map((skill, idx) => (
                <div key={idx} className="p-4 border border-[#E5E0D8] rounded-xl bg-white text-center hover:border-[#C8C2B8] transition-all shadow-sm">
                  <span className="text-sm font-bold text-[#1F2937] block">{skill.name}</span>
                  {skill.category && <span className="text-[10px] text-[#78756F] block mt-1 uppercase tracking-wider">{skill.category}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#1F2937]">
              Featured Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projs.map((project, idx) => {
                const tags = Array.isArray(project.project_tech_stack)
                  ? project.project_tech_stack
                  : typeof project.project_tech_stack === 'string'
                  ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div key={idx} className="p-6 border border-[#E5E0D8] rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#1F2937] mb-2">{project.project_name}</h3>
                      <p className="text-[#55524D] text-sm leading-relaxed mb-6">{project.project_desc}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((t, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-1 bg-[#F6F4EF] border border-[#E5E0D8] text-[#55524D] text-[10px] font-medium rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.project_github_link && (
                        <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#1F2937] hover:underline">
                          View Code &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience */}
        {exps.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#1F2937]">
              Experience
            </h2>
            <div className="space-y-4">
              {exps.map((exp, idx) => (
                <div key={idx} className="p-6 border border-[#E5E0D8] rounded-2xl bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#1F2937]">{exp.role}</h3>
                    <span className="text-xs font-semibold text-[#78756F] block mt-1">{exp.company_name}</span>
                    <p className="text-[#55524D] text-sm mt-3 leading-relaxed">{exp.work_description}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#78756F] border border-[#E5E0D8] bg-[#F6F4EF] px-3 py-1 rounded-full self-start shrink-0">
                    {exp.date_of_joining}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#1F2937]">
              Certificates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert, idx) => (
                <div key={idx} className="p-5 border border-[#E5E0D8] rounded-xl bg-white shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#1F2937]">{cert.certification_name}</h3>
                    <span className="text-xs text-[#78756F] block mt-1">Issued: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs text-[#1F2937] hover:underline font-semibold">
                      Link &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {data?.personalInfo && Object.entries(SECTION_SCHEMAS).map(([key, schema]) => (
        <DynamicSection
          key={key}
          title={schema.title}
          schema={schema}
          data={data.personalInfo[key]}
        />
      ))}

      <footer className="max-w-5xl mx-auto py-10 text-center text-xs font-serif text-[#78756F] border-t border-[#E5E0D8] mt-20 relative z-10">
        &copy; {new Date().getFullYear()} {pInfo.full_name}. Nordic Minimalist Light Edition.
      </footer>

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template18;
