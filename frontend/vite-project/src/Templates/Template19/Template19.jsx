import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DynamicSection from './components/DynamicSection';
import ChatbotWidget from '../../components/ChatbotWidget';
import { API_BASE } from '../../lib/api';
import { SECTION_SCHEMAS } from '../../lib/sectionSchemas';

const defaultData = {
  personalInfo: {
    full_name: "Neo Cipher",
    email_id: "neo@matrix-node.org",
    main_title: "Cybersecurity Specialist & Kernel Engineer",
    college_name: "MIT CSAIL",
    course_name: "B.S.",
    specialization_course_name: "Computer Science & Cryptography",
    about_paragraph: "Specializing in low-level vulnerability research, kernel exploit mitigations, secure protocol design, and high-performance C/Rust reverse engineering.",
    github_username: "neocipher",
    leetcode_username: "neo_matrix"
  },
  techStacks: [
    { name: "C / C++", category: "Language" },
    { name: "Rust", category: "Language" },
    { name: "Assembly x86_64", category: "Low Level" },
    { name: "Linux Kernel", category: "OS" },
    { name: "GDB / Ghidra", category: "Reverse Eng" },
    { name: "Wireshark", category: "Network" }
  ],
  projects: [
    {
      project_name: "Aegis Kernel Sandbox",
      project_desc: "A lightweight Linux eBPF runtime monitor detecting abnormal syscall patterns and blocking zero-day privilege escalations in real-time.",
      project_tech_stack: ["C", "eBPF", "Linux Kernel"],
      project_github_link: "https://github.com"
    },
    {
      project_name: "CipherTrace Fuzzer",
      project_desc: "A coverage-guided multi-threaded network protocol fuzzer written in Rust with automated crash triage reporting.",
      project_tech_stack: ["Rust", "LLVM", "Docker"],
      project_github_link: "https://github.com"
    }
  ],
  experiences: [
    {
      role: "Security Researcher",
      company_name: "ZeroDay Labs",
      date_of_joining: "2023-10-01",
      work_description: "Conducted security audits and penetration tests for critical infrastructure and distributed cryptography engines."
    }
  ],
  certifications: [
    {
      certification_name: "Offensive Security Certified Professional (OSCP)",
      issuing_organization: "OffSec",
      credential_url: "https://example.com"
    }
  ]
};

const Template19 = ({ publicData, isPublicView }) => {
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
      <div className="min-h-screen bg-[#060A0D] flex items-center justify-center text-emerald-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-xs uppercase font-bold">&gt; Connecting Matrix Terminal...</p>
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
    <div className="min-h-screen bg-[#070B0E] text-slate-200 font-mono p-6 sm:p-12 relative overflow-x-hidden selection:bg-emerald-500 selection:text-black pb-24">
      
      {/* Background Matrix Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-emerald-950/80 text-emerald-400 py-2 text-center text-xs font-mono uppercase tracking-widest rounded-xl mb-8 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          [!] Terminal Matrix Green Edition Preview Mode
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Terminal Top Bar */}
        <header className="flex justify-between items-center p-4 border border-emerald-500/30 rounded-xl bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-bold text-emerald-400 ml-2">root@matrix:~#</span>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
            {pInfo.github_username && (
              <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-200 transition-colors">GitHub</a>
            )}
            {pInfo.leetcode_username && (
              <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-200 transition-colors">LeetCode</a>
            )}
          </div>
        </header>

        {/* Main Terminal Window Hero */}
        <section className="p-8 sm:p-12 border border-emerald-500/40 rounded-2xl bg-black/90 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] space-y-6">
          <div className="text-xs text-emerald-500 uppercase tracking-widest font-bold">
            &gt; SYSTEM_IDENTITY_INITIALIZED
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            {pInfo.full_name} <span className="animate-pulse text-emerald-400">_</span>
          </h1>
          <p className="text-base sm:text-lg font-bold text-emerald-400">
            $ {pInfo.main_title}
          </p>
          <p className="text-slate-300 max-w-2xl text-xs leading-relaxed">
            {pInfo.about_paragraph}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t border-emerald-900/40">
            {pInfo.resume_url && (
              <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                ./cat_resume.pdf
              </a>
            )}
            <a href={`mailto:${pInfo.email_id}`} className="px-6 py-3 border border-emerald-500/50 hover:bg-emerald-950/60 text-emerald-300 font-bold text-xs uppercase tracking-widest rounded transition-all">
              ./send_packet &rarr;
            </a>
          </div>
        </section>

        {/* Tech Stack Matrix */}
        {tStacks.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-400">
              &gt; ./load_skills_matrix.sys
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {tStacks.map((skill, idx) => (
                <div key={idx} className="p-4 border border-emerald-500/30 rounded bg-black/80 text-center hover:border-emerald-400 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <span className="text-xs font-bold text-emerald-300 block">{skill.name}</span>
                  {skill.category && <span className="text-[9px] text-emerald-600 block mt-1 uppercase tracking-wider">{skill.category}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-400">
              &gt; ./list_active_projects.log
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projs.map((project, idx) => {
                const tags = Array.isArray(project.project_tech_stack)
                  ? project.project_tech_stack
                  : typeof project.project_tech_stack === 'string'
                  ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div key={idx} className="p-6 border border-emerald-500/30 rounded-xl bg-black/90 hover:border-emerald-400 transition-all flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2"># {project.project_name}</h3>
                      <p className="text-slate-300 text-xs leading-relaxed mb-6">{project.project_desc}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((t, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.project_github_link && (
                        <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-400 hover:underline">
                          &gt; git clone {project.project_name.toLowerCase().replace(/\s+/g, '')}.git
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
            <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-400">
              &gt; ./cat_execution_history.log
            </h2>
            <div className="space-y-4">
              {exps.map((exp, idx) => (
                <div key={idx} className="p-6 border border-emerald-500/30 rounded-xl bg-black/90 flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">[ROLE] {exp.role}</h3>
                    <span className="text-xs text-emerald-400 block mt-1">@ {exp.company_name}</span>
                    <p className="text-slate-300 text-xs mt-3 leading-relaxed">{exp.work_description}</p>
                  </div>
                  <span className="text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 rounded self-start shrink-0">
                    JOINED: {exp.date_of_joining}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-emerald-400">
              &gt; ./verify_credentials.key
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert, idx) => (
                <div key={idx} className="p-5 border border-emerald-500/30 rounded-lg bg-black/80 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{cert.certification_name}</h3>
                    <span className="text-[10px] text-emerald-600 block mt-1">ISSUER: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline font-bold">
                      VERIFY
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

      <footer className="max-w-5xl mx-auto py-10 text-center text-xs font-mono text-emerald-700 border-t border-emerald-900/40 mt-20 relative z-10">
        &copy; {new Date().getFullYear()} {pInfo.full_name}. Terminal Green Matrix Kernel.
      </footer>

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template19;
