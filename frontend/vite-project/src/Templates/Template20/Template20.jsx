import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DynamicSection from './components/DynamicSection';
import ChatbotWidget from '../../components/ChatbotWidget';
import { API_BASE } from '../../lib/api';
import { SECTION_SCHEMAS } from '../../lib/sectionSchemas';

const defaultData = {
  personalInfo: {
    full_name: "Victoria Sterling",
    email_id: "victoria@sterling-design.co",
    main_title: "Executive Creative Director & Tech Strategist",
    college_name: "Royal College of Art, London",
    course_name: "M.A.",
    specialization_course_name: "Design Direction & Digital Innovation",
    about_paragraph: "Curating bespoke digital experiences, luxury brand identities, and high-impact software platforms for global enterprise clients.",
    github_username: "victoriasterling",
    leetcode_username: "v_sterling"
  },
  techStacks: [
    { name: "Brand Strategy", category: "Direction" },
    { name: "UI/UX Architecture", category: "Design" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "TailwindCSS", category: "Styling" },
    { name: "Figma Studio", category: "Design" }
  ],
  projects: [
    {
      project_name: "Aura Luxury E-Commerce",
      project_desc: "A flagship digital storefront for luxury timepiece artisans featuring bespoke 3D product customizers and frictionless Checkout.",
      project_tech_stack: ["Next.js", "Three.js", "TailwindCSS"],
      project_github_link: "https://github.com"
    },
    {
      project_name: "Crown Investment Portal",
      project_desc: "A private wealth management platform providing real-time portfolio analytics, biometric authentication, and interactive asset reports.",
      project_tech_stack: ["React", "TypeScript", "Node.js"],
      project_github_link: "https://github.com"
    }
  ],
  experiences: [
    {
      role: "Executive Creative Director",
      company_name: "Sterling & Co. Design",
      date_of_joining: "2023-05-01",
      work_description: "Directing creative vision, UI/UX architecture, and technical implementation for Fortune 500 digital flagships."
    }
  ],
  certifications: [
    {
      certification_name: "International Luxury Brand Strategy Award",
      issuing_organization: "Global Design Council",
      credential_url: "https://example.com"
    }
  ]
};

const Template20 = ({ publicData, isPublicView }) => {
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
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center text-[#D4AF37] font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-xs uppercase font-bold">Unveiling Luxury Gold Velvet...</p>
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
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 font-serif p-6 sm:p-12 relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black pb-24">
      
      {/* Background Gold Ambient Glow */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none" />

      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#181610] text-[#F3E5AB] py-2 text-center text-xs font-serif uppercase tracking-widest rounded-xl mb-8 border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          ✦ Luxury Gold Velvet Preview Mode
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-14 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-[#D4AF37]/30">
          <span className="text-2xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
            {pInfo.full_name || 'STERLING'}
          </span>
          <div className="flex gap-6 text-xs font-sans uppercase tracking-wider text-[#D4AF37]">
            {pInfo.github_username && (
              <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="hover:text-[#F3E5AB] transition-colors">GitHub</a>
            )}
            {pInfo.leetcode_username && (
              <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="hover:text-[#F3E5AB] transition-colors">LeetCode</a>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="p-8 sm:p-14 border border-[#D4AF37]/40 rounded-3xl bg-[#121218]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(212,175,55,0.15)] space-y-6">
          <div className="inline-block px-4 py-1 bg-[#1A1812] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-serif uppercase tracking-widest rounded-full">
            ✦ BESPOKE DIGITAL CREATION
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-none">
            {pInfo.full_name}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            {pInfo.main_title}
          </p>
          <p className="text-slate-300 max-w-2xl text-base leading-relaxed font-sans">
            {pInfo.about_paragraph}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#D4AF37]/20 font-sans">
            {pInfo.resume_url && (
              <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5BF47] hover:to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                Acquire Portfolio Dossier ✦
              </a>
            )}
            <a href={`mailto:${pInfo.email_id}`} className="px-8 py-3.5 border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#F3E5AB] font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
              Private Inquiry &rarr;
            </a>
          </div>
        </section>

        {/* Tech Stack */}
        {tStacks.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              ✦ Specialized Disciplines
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {tStacks.map((skill, idx) => (
                <div key={idx} className="p-4 border border-[#D4AF37]/30 rounded-xl bg-[#121218]/60 text-center hover:border-[#D4AF37]/60 transition-all font-sans">
                  <span className="text-sm font-bold text-[#F3E5AB] block">{skill.name}</span>
                  {skill.category && <span className="text-[10px] text-[#D4AF37] block mt-1 uppercase tracking-wider">{skill.category}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              ✦ Curated Folio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projs.map((project, idx) => {
                const tags = Array.isArray(project.project_tech_stack)
                  ? project.project_tech_stack
                  : typeof project.project_tech_stack === 'string'
                  ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div key={idx} className="p-6 border border-[#D4AF37]/30 rounded-2xl bg-[#121218]/80 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-white mb-2">{project.project_name}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">{project.project_desc}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-6 font-sans">
                        {tags.map((t, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-1 bg-[#1A1812] border border-[#D4AF37]/30 text-[#F3E5AB] text-[10px] rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.project_github_link && (
                        <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs font-sans font-bold text-[#D4AF37] hover:text-[#F3E5AB]">
                          View Work &rarr;
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
            <h2 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              ✦ Executive Tenure
            </h2>
            <div className="space-y-4">
              {exps.map((exp, idx) => (
                <div key={idx} className="p-6 border border-[#D4AF37]/30 rounded-2xl bg-[#121218]/80 flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white">{exp.role}</h3>
                    <span className="text-xs font-sans text-[#D4AF37] block mt-1">{exp.company_name}</span>
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed font-sans">{exp.work_description}</p>
                  </div>
                  <span className="text-xs font-sans text-[#F3E5AB] border border-[#D4AF37]/30 bg-[#1A1812] px-3 py-1 rounded-full self-start shrink-0">
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
            <h2 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              ✦ Distinction & Honors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert, idx) => (
                <div key={idx} className="p-5 border border-[#D4AF37]/30 rounded-xl bg-[#121218]/60 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white">{cert.certification_name}</h3>
                    <span className="text-xs font-sans text-[#D4AF37] block mt-1">Conferred: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs font-sans text-[#F3E5AB] hover:underline font-bold">
                      Inspect &rarr;
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

      <footer className="max-w-5xl mx-auto py-10 text-center text-xs font-serif text-[#D4AF37]/60 border-t border-[#D4AF37]/20 mt-20 relative z-10">
        &copy; {new Date().getFullYear()} {pInfo.full_name}. Luxury Gold Velvet Architecture.
      </footer>

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template20;
