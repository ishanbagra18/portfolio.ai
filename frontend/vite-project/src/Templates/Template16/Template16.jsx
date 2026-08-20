import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DynamicSection from './components/DynamicSection';
import ChatbotWidget from '../../components/ChatbotWidget';
import { API_BASE } from '../../lib/api';
import { SECTION_SCHEMAS } from '../../lib/sectionSchemas';

const defaultData = {
  personalInfo: {
    full_name: "Alex Vance",
    email_id: "alex.vance@synthwave.dev",
    main_title: "Cybernetic Systems Developer & Creative Technologist",
    college_name: "Neo Tokyo Institute of Technology",
    course_name: "B.S.",
    specialization_course_name: "Computer Science & Cybernetics",
    about_paragraph: "Building high-performance futuristic web applications, real-time audio visualizers, and synthwave-inspired UI experiences with clean scalable code.",
    github_username: "alexvance",
    leetcode_username: "alexvance"
  },
  techStacks: [
    { name: "React", category: "Frontend" },
    { name: "Three.js", category: "Graphics" },
    { name: "Node.js", category: "Backend" },
    { name: "WebAudio API", category: "Media" },
    { name: "TailwindCSS", category: "Styling" },
    { name: "WebGL", category: "Graphics" }
  ],
  projects: [
    {
      project_name: "SynthPulse Audio Engine",
      project_desc: "A 3D browser-based audio spectrum visualizer with real-time shader effects and interactive MIDI input mapping.",
      project_tech_stack: ["React", "Three.js", "WebAudio API"],
      project_github_link: "https://github.com"
    },
    {
      project_name: "CyberGrid Terminal",
      project_desc: "A retro-futuristic developer workbench dashboard featuring live RSS feeds, system health telemetry, and neon aesthetic widgets.",
      project_tech_stack: ["Node.js", "Electron", "React"],
      project_github_link: "https://github.com"
    }
  ],
  experiences: [
    {
      role: "Senior Frontend Engineer",
      company_name: "Neon Labs Inc.",
      date_of_joining: "2024-01-15",
      work_description: "Architected high-throughput web dashboards and GLSL shader integration for interactive client experiences."
    }
  ],
  certifications: [
    {
      certification_name: "WebGL 3D Rendering Specialist",
      issuing_organization: "Graphics Academy",
      credential_url: "https://example.com"
    }
  ]
};

const Template16 = ({ publicData, isPublicView }) => {
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
      <div className="min-h-screen bg-[#0d0714] flex items-center justify-center text-fuchsia-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-xs uppercase font-bold">Booting Vaporwave Grid...</p>
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
    <div className="min-h-screen bg-[#090511] text-slate-100 font-sans p-6 sm:p-12 relative overflow-x-hidden selection:bg-fuchsia-500 selection:text-white pb-24">
      {/* Background Synth Grid Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(217, 70, 239, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Hero Glow Blobs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white py-2 text-center text-xs font-mono uppercase tracking-widest rounded-xl mb-8 shadow-[0_0_20px_rgba(217,70,239,0.4)]">
          ⚡ Vaporwave Synthwave Preview Mode
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center p-6 border border-fuchsia-500/30 rounded-2xl bg-black/60 backdrop-blur-xl shadow-[0_0_25px_rgba(217,70,239,0.2)]">
          <span className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {pInfo.full_name?.split(' ')[0] || 'VAPOR'}.SYS
          </span>
          <div className="flex gap-4 text-xs font-mono uppercase tracking-wider">
            {pInfo.github_username && (
              <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">GitHub</a>
            )}
            {pInfo.leetcode_username && (
              <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">LeetCode</a>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="p-8 sm:p-12 border border-fuchsia-500/40 rounded-3xl bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(217,70,239,0.25)] relative overflow-hidden">
          <div className="inline-block px-4 py-1.5 bg-fuchsia-950/60 border border-fuchsia-500/40 text-cyan-300 text-xs font-mono uppercase tracking-widest rounded-full mb-6">
            // NEON SYNTH EDITION
          </div>
          <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white mb-4 leading-none">
            {pInfo.full_name}
          </h1>
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            {pInfo.main_title}
          </p>
          <p className="text-slate-300 max-w-2xl text-base leading-relaxed mb-8">
            {pInfo.about_paragraph}
          </p>
          
          <div className="flex flex-wrap gap-4">
            {pInfo.resume_url && (
              <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
                Download Resume ⚡
              </a>
            )}
            <a href={`mailto:${pInfo.email_id}`} className="px-8 py-3.5 border border-cyan-400/50 hover:bg-cyan-500/10 text-cyan-300 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
              Initialize Contact &rarr;
            </a>
          </div>
        </section>

        {/* Tech Stack */}
        {tStacks.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              // Tech Stack Matrix
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {tStacks.map((skill, idx) => (
                <div key={idx} className="p-4 border border-fuchsia-500/20 rounded-xl bg-black/60 backdrop-blur-md text-center hover:border-cyan-400/50 transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]">
                  <span className="text-sm font-bold text-fuchsia-300 block">{skill.name}</span>
                  {skill.category && <span className="text-[10px] font-mono text-cyan-400 block mt-1 uppercase tracking-wider">{skill.category}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              // Featured Builds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projs.map((project, idx) => {
                const tags = Array.isArray(project.project_tech_stack)
                  ? project.project_tech_stack
                  : typeof project.project_tech_stack === 'string'
                  ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div key={idx} className="p-6 border border-fuchsia-500/30 rounded-2xl bg-black/70 backdrop-blur-xl hover:border-cyan-400/60 transition-all flex flex-col justify-between shadow-[0_0_20px_rgba(217,70,239,0.15)]">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{project.project_name}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">{project.project_desc}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((t, tIdx) => (
                          <span key={tIdx} className="px-2.5 py-1 bg-fuchsia-950/40 border border-fuchsia-500/30 text-cyan-300 text-[10px] font-mono rounded-lg">
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.project_github_link && (
                        <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs font-mono font-bold text-fuchsia-400 hover:text-cyan-300 transition-colors">
                          View Code Base &rarr;
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
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              // Experience Timeline
            </h2>
            <div className="space-y-4">
              {exps.map((exp, idx) => (
                <div key={idx} className="p-6 border border-fuchsia-500/30 rounded-2xl bg-black/70 backdrop-blur-xl flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <span className="text-xs font-mono text-cyan-400 block mt-1">{exp.company_name}</span>
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">{exp.work_description}</p>
                  </div>
                  <span className="text-xs font-mono text-fuchsia-400 border border-fuchsia-500/30 bg-fuchsia-950/40 px-3 py-1 rounded-full self-start shrink-0">
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
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              // Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert, idx) => (
                <div key={idx} className="p-5 border border-fuchsia-500/30 rounded-xl bg-black/60 backdrop-blur-md flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white">{cert.certification_name}</h3>
                    <span className="text-xs text-slate-400 block mt-1">Issued: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-cyan-400 hover:text-fuchsia-300 underline">
                      Verify &rarr;
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

      <footer className="max-w-5xl mx-auto py-10 text-center text-xs font-mono text-slate-500 border-t border-fuchsia-500/20 mt-20 relative z-10">
        &copy; {new Date().getFullYear()} {pInfo.full_name}. Powered by Vaporwave Synthwave Engine.
      </footer>

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template16;
