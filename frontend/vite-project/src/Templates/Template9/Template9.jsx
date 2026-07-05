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

const Template9 = ({ publicData, isPublicView }) => {
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
  }, [portfolioId, publicData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center text-[#33FF33] font-mono">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-pulse text-lg">CONNECTING 1200 BAUD...</span>
          <div className="w-24 h-4 bg-[#33FF33]/20 border border-[#33FF33] relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 bg-[#33FF33] w-1/2 animate-[pulse_1.5s_infinite]"></div>
          </div>
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
    <div className="min-h-screen bg-black text-[#33FF33] font-mono p-4 sm:p-8 relative selection:bg-[#33FF33] selection:text-black">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none bg-scanlines opacity-[0.04] z-[999]" />
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="border border-[#33FF33] text-center p-2 mb-6 text-xs uppercase animate-pulse">
          *** WARNING: SAMPLE PREVIEW. LOG IN OR LOAD DB DATA TO COMPILE ***
        </div>
      )}

      {/* Main Terminal Window */}
      <div className="max-w-6xl mx-auto border-double border-4 border-[#33FF33] bg-[#020202] p-6 sm:p-10 shadow-[0_0_20px_rgba(51,255,51,0.15)]">
        
        {/* Terminal Header */}
        <div className="border-b border-[#33FF33] pb-6 mb-8">
          <pre className="text-xs sm:text-sm overflow-x-auto leading-none text-[#33FF33] opacity-80">
{`
   ____ ____ _____    ____ ___  _   _ ____   ___  _     _____ 
  / ___|  _ \\_   _|  / ___/ _ \\| \\ | / ___| / _ \\| |   | ____|
 | |   | |_) || |   | |  | | | |  \\| \\___ \\| | | | |   |  _|  
 | |___|  _ < | |   | |__| |_| | |\\  |___) | |_| | |___| |___ 
  \\____|_| \\_\\|_|    \\____\\___/|_| \\_|____/ \\___/|_____|_____|
`}
          </pre>
          <div className="mt-4 flex flex-col sm:flex-row justify-between text-xs opacity-75">
            <span>SYS_VERSION: 1982-A</span>
            <span>BAUD_RATE: 9600</span>
            <span>PORT: COM1</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-12">
          <div className="mb-2 text-white font-bold">&gt; RUN INTRO.EXE</div>
          <div className="pl-4 border-l border-[#33FF33]/50">
            <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wider mb-2">
              {pInfo.full_name}
            </h1>
            <p className="text-sm font-semibold opacity-80 mb-4">// {pInfo.main_title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs opacity-90 pt-2">
              <div>EMAIL: {pInfo.email_id}</div>
              {pInfo.github_username && <div>GITHUB: github.com/{pInfo.github_username}</div>}
              {pInfo.leetcode_username && <div>LEETCODE: leetcode.com/{pInfo.leetcode_username}</div>}
              {pInfo.address && <div>LOC: {pInfo.address}</div>}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12">
          <div className="mb-2 text-white font-bold">&gt; READ PROFILE.TXT</div>
          <div className="pl-4 border-l border-[#33FF33]/50 text-sm leading-relaxed opacity-95">
            <p className="mb-6">{pInfo.about_paragraph}</p>
            {pInfo.college_name && (
              <div className="border border-[#33FF33]/30 p-4 bg-black/40 text-xs">
                <span className="text-white font-bold block mb-1">SYSTEM EDUCATION INVENTORY:</span>
                <span>{pInfo.college_name}</span>
                <span className="block opacity-75">{pInfo.course_name} {pInfo.specialization_course_name && `(${pInfo.specialization_course_name})`}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <div className="mb-2 text-white font-bold">&gt; EXEC LIST_CORE_SYSTEMS.SYS</div>
          <div className="pl-4 border-l border-[#33FF33]/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tStacks.reduce((acc, curr) => {
                const cat = curr.category || 'GENERAL';
                const found = acc.find(c => c.category === cat);
                if (found) found.skills.push(curr.name);
                else acc.push({ category: cat, skills: [curr.name] });
                return acc;
              }, []).map((catObj, idx) => (
                <div key={idx} className="border border-[#33FF33]/30 p-4 bg-[#050505]">
                  <div className="text-white font-bold text-xs mb-3 border-b border-[#33FF33]/30 pb-1">
                    + {catObj.category.toUpperCase()}
                  </div>
                  <ul className="text-xs space-y-1 opacity-90">
                    {catObj.skills.map((skill, sIdx) => (
                      <li key={sIdx}>* {skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <div className="mb-2 text-white font-bold">&gt; DIR PROJECTS/</div>
          <div className="pl-4 border-l border-[#33FF33]/50 space-y-8">
            {projs.map((project, idx) => {
              const tags = Array.isArray(project.project_tech_stack)
                ? project.project_tech_stack
                : typeof project.project_tech_stack === 'string'
                ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [];
              return (
                <div key={idx} className="border border-[#33FF33]/30 p-6 bg-black/40">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#33FF33]/30 pb-2 mb-4 gap-2">
                    <h3 className="text-lg font-black text-white">{project.project_name}</h3>
                    <span className="text-xs bg-[#33FF33]/10 border border-[#33FF33]/40 px-2 py-0.5 font-bold">
                      FILE_INDEX: 0{idx + 1}
                    </span>
                  </div>
                  {project.project_image && (
                    <div className="mb-4 max-w-sm border border-[#33FF33]/30 overflow-hidden">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover filter grayscale contrast-150 brightness-75" />
                    </div>
                  )}
                  <p className="text-xs opacity-75 mb-2">[DESCRIPTION]</p>
                  <p className="text-sm leading-relaxed opacity-95 mb-4">{project.project_desc}</p>
                  <div className="text-xs opacity-85 mb-4">
                    <span className="text-white font-bold">STK:</span> {tags.join(' // ')}
                  </div>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs text-white border border-[#33FF33]/50 hover:bg-[#33FF33]/20 px-3 py-1 font-bold tracking-wider inline-block">
                      LINK_TO_REPOS
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience Section */}
        {exps.length > 0 && (
          <section className="mb-12">
            <div className="mb-2 text-white font-bold">&gt; READ RECORD_EXPERIENCE.DAT</div>
            <div className="pl-4 border-l border-[#33FF33]/50 space-y-6">
              {exps.map((exp, idx) => (
                <div key={idx} className="border border-[#33FF33]/30 p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 text-xs font-bold text-white">
                    <span>ROLE: {exp.role.toUpperCase()}</span>
                    <span>JOINED: {exp.date_of_joining}</span>
                  </div>
                  <div className="text-xs opacity-75 mb-3">COMPANY: {exp.company_name}</div>
                  <p className="text-xs leading-relaxed opacity-90">{exp.work_description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certs.length > 0 && (
          <section className="mb-12">
            <div className="mb-2 text-white font-bold">&gt; SHOW CREDENTIALS</div>
            <div className="pl-4 border-l border-[#33FF33]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certs.map((cert, idx) => (
                <div key={idx} className="border border-[#33FF33]/30 p-4 text-xs">
                  <div className="font-bold text-white">{cert.certification_name.toUpperCase()}</div>
                  <div className="opacity-70 mt-1">ISSUER: {cert.issuing_organization}</div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="mt-3 inline-block hover:underline">
                      &gt; VERIFY_LINK
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Terminal Footer */}
        <div className="border-t border-[#33FF33] pt-6 flex flex-col sm:flex-row justify-between text-xs opacity-75 gap-2">
          <span>&copy; {new Date().getFullYear()} {pInfo.full_name}</span>
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="text-white hover:underline uppercase">
              DOWNLOAD CV_FILE
            </a>
          )}
          <span className="flex items-center gap-1">
            STATUS: ACTIVE
            <span className="w-2.5 h-2.5 bg-[#33FF33] inline-block animate-[pulse_1s_infinite]" />
          </span>
        </div>
      </div>

      {/* Floating print overlay */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print to Console (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-black border border-[#33FF33] hover:bg-[#33FF33]/20 text-[#33FF33] font-bold uppercase tracking-wider text-[10px] shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Print File</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template9;
