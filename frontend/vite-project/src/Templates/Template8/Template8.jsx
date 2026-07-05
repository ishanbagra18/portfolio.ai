import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChatbotWidget from '../../components/ChatbotWidget';
import { API_BASE } from '../../lib/api';

const defaultData = {
  personalInfo: {
    full_name: "Ishan Bagra",
    email_id: "ishanbagra2@gmail.com",
    main_title: "Full-Stack Software Developer",
    college_name: "Indian Institute of Information Technology, Kota",
    course_name: "B.Tech",
    about_paragraph: "I am a Full-Stack Developer with a strong focus on backend systems, machine learning, and algorithmic problem-solving in C++. I enjoy participating in competitive programming and building scalable applications.",
    github_username: "ishanbagra18",
    leetcode_username: "ishanbagra"
  },
  techStacks: [
    { name: "C++", category: "Language" },
    { name: "Go", category: "Language" },
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Gin", category: "Backend" },
    { name: "MongoDB", category: "Database" }
  ],
  projects: [
    {
      project_name: "GeetHub",
      project_desc: "A comprehensive music streaming application featuring playlist management, secure user authentication, and playback history tracking.",
      project_tech_stack: ["React", "Go", "Gin", "MongoDB"],
      project_github_link: "https://github.com/ishanbagra/geethub"
    },
    {
      project_name: "Data Mukti (Project ZeroWaste)",
      project_desc: "A cross-platform secure data-wiping solution aligned with NIST SP 800-88 standards, designed to prevent data breaches during e-waste recycling.",
      project_tech_stack: ["React", "Node.js", "Electron"],
      project_github_link: "https://github.com/ishanbagra/datamukti"
    }
  ],
  experiences: [
    {
      role: "Team Lead - SIH 2025",
      company_name: "Team ZeroGrid",
      date_of_joining: "2025-12-01",
      work_description: "Led the development of a hybrid renewable energy generation solution, managing both the technical architecture and team coordination during the Smart India Hackathon."
    }
  ],
  certifications: [
    {
      certification_name: "Machine Learning and Statistics",
      issuing_organization: "Coursera",
      credential_url: "https://coursera.org/verify/dummy-link"
    }
  ]
};

const Template8 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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
  }, [portfolioId, publicData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center text-[#39FF14] font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-sm uppercase">INIT_DECRYPT_SEQUENCE...</p>
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
    <div className="min-h-screen bg-[#08090C] text-[#D1D7E0] font-['Space_Mono'] relative overflow-x-hidden selection:bg-[#39FF14] selection:text-black">
      {/* Subtle scanline effect overlay */}
      <div className="fixed inset-0 bg-scanlines pointer-events-none opacity-[0.03] z-[999]" />
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#FF007F]/10 border-b border-[#FF007F]/30 text-[#FF007F] px-4 py-2 text-center text-xs font-bold tracking-widest uppercase">
          // CRITICAL: VIEWING SAMPLE PREVIEW. INJECT USER DATA TO COMPILE.
        </div>
      )}

      {/* Terminal Title Bar */}
      <header className="border-b border-[#1E2530] bg-[#0F1219] px-6 py-4 flex justify-between items-center text-xs text-[#6272A4]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5555]"></span>
          <span className="w-3 h-3 rounded-full bg-[#F1FA8C]"></span>
          <span className="w-3 h-3 rounded-full bg-[#50FA7B]"></span>
          <span className="ml-2 text-emerald-400 font-bold font-mono">PORTFOLIO_NODE v4.0.9</span>
        </div>
        <div>
          LOC: <span className="text-cyan-400">{pInfo.address || 'REMOTE'}</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="border border-[#39FF14]/30 bg-[#0F1219]/60 p-8 md:p-12 relative shadow-[0_0_15px_rgba(57,255,20,0.05)]">
          {/* Accent corners */}
          <div className="absolute top-[-1px] left-[-1px] w-4 h-4 border-t-2 border-l-2 border-[#39FF14]" />
          <div className="absolute top-[-1px] right-[-1px] w-4 h-4 border-t-2 border-r-2 border-[#39FF14]" />
          <div className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-b-2 border-l-2 border-[#39FF14]" />
          <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 border-b-2 border-r-2 border-[#39FF14]" />

          <p className="text-cyan-400 text-sm mb-4 tracking-wider">&gt; guest@cybercore:~$ whoami</p>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight uppercase">
            {pInfo.full_name}
          </h1>
          <p className="text-xs text-[#FF007F] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#FF007F] inline-block animate-pulse"></span>
            ROLE // {pInfo.main_title}
          </p>

          <div className="border-t border-[#1E2530] pt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex gap-2">
              <span className="text-[#6272A4]">EMAIL:</span>
              <a href={`mailto:${pInfo.email_id}`} className="text-emerald-400 hover:underline">{pInfo.email_id}</a>
            </div>
            {pInfo.github_username && (
              <div className="flex gap-2">
                <span className="text-[#6272A4]">GITHUB:</span>
                <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/{pInfo.github_username}</a>
              </div>
            )}
            {pInfo.leetcode_username && (
              <div className="flex gap-2">
                <span className="text-[#6272A4]">LEETCODE:</span>
                <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline">/{pInfo.leetcode_username}</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-cyan-400 uppercase">
          <span>[01]</span> cat profile_data.log
        </h2>
        <div className="border border-[#1E2530] bg-[#0A0D14] p-6 text-sm leading-relaxed text-[#A4B3C6]">
          <p className="mb-6">{pInfo.about_paragraph}</p>
          
          {pInfo.college_name && (
            <div className="pt-6 border-t border-[#1E2530] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#FF007F] font-bold block mb-1">SYSTEM_EDUCATION:</span>
                <span className="text-white block">{pInfo.college_name}</span>
                <span className="text-cyan-400">{pInfo.course_name} {pInfo.specialization_course_name && `(${pInfo.specialization_course_name})`}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-[#39FF14] uppercase">
          <span>[02]</span> ./list_skills.sh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tStacks.reduce((acc, curr) => {
            const cat = curr.category || 'OTHER';
            const existing = acc.find(item => item.category === cat);
            if (existing) {
              existing.skills.push(curr.name);
            } else {
              acc.push({ category: cat, skills: [curr.name] });
            }
            return acc;
          }, []).map((catObj, idx) => (
            <div key={idx} className="border border-[#1E2530] bg-[#0A0D14] p-6">
              <span className="text-xs text-[#FF007F] font-bold tracking-widest block mb-4"># {catObj.category.toUpperCase()}</span>
              <div className="flex flex-wrap gap-2">
                {catObj.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2 py-1 bg-[#161B26] border border-[#2E3B52] text-xs text-[#39FF14]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-[#FF007F] uppercase">
          <span>[03]</span> ls -la ~/projects
        </h2>
        <div className="space-y-6">
          {projs.map((project, idx) => {
            const tags = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === 'string'
              ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
              : [];
            return (
              <div key={idx} className="border border-[#1E2530] hover:border-[#39FF14]/50 bg-[#0F1219]/40 p-6 md:p-8 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {project.project_image && (
                    <div className="w-full md:w-64 shrink-0 rounded overflow-hidden border border-[#2E3B52]">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white uppercase">{project.project_name}</h3>
                        <span className="text-xs text-[#FF007F] font-bold">PROJ_0{idx + 1}</span>
                      </div>
                      <p className="text-xs text-[#6272A4] mb-4">// DESCRIPTION</p>
                      <p className="text-sm text-[#A4B3C6] leading-relaxed mb-6">{project.project_desc}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-xs text-cyan-400 font-semibold bg-[#161B26] px-2 py-0.5 border border-[#2E3B52]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {project.project_github_link && (
                        <a href={project.project_github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#39FF14] hover:underline uppercase tracking-wider">
                          &gt;&gt; ESTABLISH_LINK
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Section */}
      {exps.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-yellow-400 uppercase">
            <span>[04]</span> cat ~/work_history.json
          </h2>
          <div className="border border-[#1E2530] bg-[#0A0D14] p-6 space-y-8">
            {exps.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-[#FF007F] pl-6 py-2 relative">
                <div className="absolute left-[-6px] top-4 w-[10px] h-[10px] bg-[#FF007F]" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase">{exp.role}</h3>
                    <span className="text-xs text-[#39FF14] font-bold">{exp.company_name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#6272A4] bg-[#0F1219] border border-[#1E2530] px-2 py-1 uppercase">
                    JOINED: {exp.date_of_joining}
                  </span>
                </div>
                <p className="text-sm text-[#A4B3C6] leading-relaxed">{exp.work_description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 text-cyan-400 uppercase">
            <span>[05]</span> query --certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert, idx) => (
              <div key={idx} className="border border-[#1E2530] bg-[#0A0D14] p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">{cert.certification_name}</h3>
                  <span className="text-xs text-[#6272A4] block mt-1">ISSUER // {cert.issuing_organization}</span>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs text-[#39FF14] border border-[#39FF14] hover:bg-[#39FF14]/10 px-3 py-1.5 font-bold uppercase tracking-wider transition-colors shrink-0 ml-4">
                    VERIFY
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1E2530] bg-[#0F1219]/60 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6272A4] font-mono">
          <span>// TERMINAL TERMINATED. SYSTEM IDLE.</span>
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="text-[#39FF14] hover:underline uppercase tracking-wider font-bold">
              DOWNLOAD_CV.PDF
            </a>
          )}
          <span>&copy; {new Date().getFullYear()} {pInfo.full_name}</span>
        </div>
      </footer>

      {/* Print Float Action */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Download as Resume (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800 text-slate-100 font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-2xl backdrop-blur flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Download PDF</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template8;
