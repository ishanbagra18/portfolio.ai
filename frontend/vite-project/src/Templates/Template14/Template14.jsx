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

const Template14 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap';
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
      <div className="min-h-screen bg-[#050C1A] flex items-center justify-center text-cyan-400 font-mono">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-pulse">SYS_CALIBRATING_HUD...</span>
          <div className="w-12 h-1 bg-cyan-400 animate-ping"></div>
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
    <div className="min-h-screen bg-[#060B14] text-[#8696B2] font-['Roboto_Mono'] text-xs p-4 sm:p-8 relative selection:bg-cyan-500/30 selection:text-white">
      {/* HUD Telemetry Elements */}
      <div className="absolute top-4 left-4 text-[8px] text-cyan-400/40">SYS_COORDS: 45.109.N / 23.498.E</div>
      <div className="absolute bottom-4 right-4 text-[8px] text-cyan-400/40">HUD_GRID_REF: A-9 // SECURE_SHELL</div>
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="border border-amber-500/40 bg-amber-500/5 text-amber-400/80 text-center p-2.5 mb-8 text-[9px] uppercase tracking-widest relative z-50">
          [!] HUD_ALERT: RUNNING PREVIEW CACHE FILE. SYSTEM STANDBY.
        </div>
      )}

      {/* Main Tactical Box */}
      <div className="max-w-6xl mx-auto border border-cyan-500/20 bg-[#0A1120]/80 p-6 sm:p-10 relative">
        {/* Tactical Crosshair Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* HUD Subtitle Bar */}
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4 mb-8 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 inline-block animate-pulse"></span>
            SYS_ENGAGED // PROFILE_TELEMETRY
          </div>
          <div>STATUS: ACTIVE</div>
        </div>

        {/* Hero Section */}
        <section className="mb-12 border border-cyan-500/10 p-6 sm:p-8 bg-[#0C1528] relative">
          <div className="absolute top-0 right-0 p-2 text-[8px] text-cyan-400/40 font-mono">SYS_CORE_METRICS</div>
          <div className="absolute top-2 left-2 text-[10px] text-cyan-400">[H_01]</div>
          
          <div className="pt-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-wider mb-2">
              {pInfo.full_name}
            </h1>
            <p className="text-amber-500 font-semibold mb-6 uppercase tracking-widest text-[10px]">
              &gt; DESIGNATION: {pInfo.main_title}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-[#8696B2] border-t border-cyan-500/10 pt-4">
              <div>EMAIL: <a href={`mailto:${pInfo.email_id}`} className="text-cyan-400 hover:underline">{pInfo.email_id}</a></div>
              {pInfo.github_username && <div>GITHUB: <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/{pInfo.github_username}</a></div>}
              {pInfo.leetcode_username && <div>LEETCODE: <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/{pInfo.leetcode_username}</a></div>}
              {pInfo.address && <div>LOC: {pInfo.address?.toUpperCase()}</div>}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12 border border-cyan-500/10 p-6 bg-[#080E1B]">
          <div className="text-[10px] text-cyan-400 font-bold mb-4 uppercase tracking-wider">// SYSTEM_PROFILE_DATA</div>
          <p className="leading-relaxed mb-6 text-white/80">{pInfo.about_paragraph}</p>
          
          {pInfo.college_name && (
            <div className="border-t border-cyan-500/10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
              <div>
                <span className="text-amber-500 font-bold block mb-1">ACADEMIC_INSTITUTION:</span>
                <span className="text-white block">{pInfo.college_name?.toUpperCase()}</span>
                <span className="text-cyan-400/80">{pInfo.course_name?.toUpperCase()} {pInfo.specialization_course_name && `(${pInfo.specialization_course_name?.toUpperCase()})`}</span>
              </div>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <div className="text-[10px] text-cyan-400 font-bold mb-6 uppercase tracking-wider">// TECHNICAL_STRENGTH_BARS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tStacks.reduce((acc, curr) => {
              const cat = curr.category || 'GENERAL';
              const found = acc.find(c => c.category === cat);
              if (found) found.skills.push(curr.name);
              else acc.push({ category: cat, skills: [curr.name] });
              return acc;
            }, []).map((catObj, idx) => (
              <div key={idx} className="border border-cyan-500/10 p-4 bg-[#0A1221]">
                <div className="text-[10px] text-white font-bold mb-4 border-b border-cyan-500/20 pb-1 uppercase">
                  {catObj.category}
                </div>
                <ul className="space-y-3">
                  {catObj.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span>{skill}</span>
                        <span className="text-cyan-400">100%</span>
                      </div>
                      {/* Telemetry bar */}
                      <div className="w-full bg-[#14223A] h-1.5 rounded overflow-hidden flex gap-[2px]">
                        <div className="bg-cyan-400 h-full w-[85%]"></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="text-[10px] text-cyan-400 font-bold mb-6 uppercase tracking-wider">// COMMITTED_PROJECT_DOCK</div>
          <div className="space-y-6">
            {projs.map((project, idx) => {
              const tags = Array.isArray(project.project_tech_stack)
                ? project.project_tech_stack
                : typeof project.project_tech_stack === 'string'
                ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [];
              return (
                <div key={idx} className="border border-cyan-500/10 p-6 bg-[#080E1B] hover:border-cyan-400/30 transition-colors relative">
                  <div className="absolute top-2 right-2 text-[8px] text-cyan-400/40">PROJ_REF: {idx + 1}00_UNIT</div>
                  
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2 mb-4">
                    <h3 className="text-white font-bold uppercase">{project.project_name}</h3>
                  </div>
                  {project.project_image && (
                    <div className="mb-4 max-w-sm border border-cyan-500/20 overflow-hidden bg-black p-1">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover filter grayscale contrast-120" />
                    </div>
                  )}
                  <p className="text-[10px] text-[#8696B2] leading-relaxed mb-4">{project.project_desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 text-[9px]">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-[10px] text-amber-500 font-bold hover:underline uppercase">
                      &gt; ACC_REPOSITORY_ACCESS
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience Section */}
        {exps.length > 0 && (
          <section className="mb-12 border border-cyan-500/10 p-6 bg-[#080D1A]">
            <div className="text-[10px] text-cyan-400 font-bold mb-6 uppercase tracking-wider">// CHRONO_WORK_TELEMETRY</div>
            <div className="space-y-6">
              {exps.map((exp, idx) => (
                <div key={idx} className="border-l border-cyan-500/30 pl-4 py-2 relative">
                  <div className="absolute left-[-3px] top-4 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <div className="flex flex-col sm:flex-row justify-between text-white font-bold mb-2 gap-2 text-[10px]">
                    <span>ROLE: {exp.role?.toUpperCase()}</span>
                    <span className="text-amber-500">CORP: {exp.company_name?.toUpperCase()}</span>
                  </div>
                  <div className="text-[9px] text-[#5A6E8C] mb-3">TIMESTAMP: {exp.date_of_joining}</div>
                  <p className="leading-relaxed text-[#8696B2] text-[10px]">{exp.work_description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certs.length > 0 && (
          <section className="mb-12">
            <div className="text-[10px] text-cyan-400 font-bold mb-6 uppercase tracking-wider">// CREDENTIAL_KEYS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div key={idx} className="border border-cyan-500/10 p-4 bg-[#0A1221] flex justify-between items-center text-[10px]">
                  <div>
                    <h3 className="text-white uppercase leading-snug font-bold">{cert.certification_name}</h3>
                    <span className="text-[#5A6E8C] block mt-1">ISSUER: {cert.issuing_organization?.toUpperCase()}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 px-3 py-1.5 font-bold uppercase transition-colors shrink-0 ml-4">
                      VERIFY_KEY
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HUD Footer */}
        <div className="border-t border-cyan-500/20 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-cyan-400/40 gap-4">
          <span>&copy; {new Date().getFullYear()} {pInfo.full_name?.toUpperCase()}</span>
          <span>CALIBRATION: SECURE</span>
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline uppercase">
              HUD_EXPORT_CV.PDF
            </a>
          )}
        </div>
      </div>

      {/* PDF Save */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print ROM (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-[#0C1528] border border-cyan-500 hover:bg-cyan-500/10 text-cyan-400 font-bold uppercase tracking-wider text-[10px] shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>HUD Export PDF</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template14;
