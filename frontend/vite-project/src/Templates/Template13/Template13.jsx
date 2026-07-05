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

const Template13 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
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
      <div className="min-h-screen bg-[#140526] flex items-center justify-center text-[#FFD700] font-mono">
        <div className="flex flex-col items-center gap-3">
          <p className="animate-bounce uppercase text-xs tracking-widest text-[#FF55FF]">LOADING LEVEL 1...</p>
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
    <div className="min-h-screen bg-[#110221] text-[#E0D8EE] font-['Press_Start_2P'] p-4 sm:p-8 text-[10px] leading-relaxed relative selection:bg-[#FFFF00] selection:text-black">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="border-4 border-dashed border-[#FF007F] text-center p-3 mb-8 text-[#FF007F] animate-pulse text-[8px]">
          [ STAGE SELECT PREVIEW MODE ] INJECT PLAYER PROFILE DATA
        </div>
      )}

      {/* Main Game Frame */}
      <div className="max-w-5xl mx-auto border-4 border-white bg-[#19092E] p-6 sm:p-10 shadow-[8px_8px_0px_#000000]">
        
        {/* Top Status HUD */}
        <div className="flex flex-wrap justify-between border-b-4 border-white pb-6 mb-8 text-[#00FFFF] text-[8px] sm:text-[10px] gap-4">
          <div>PLAYER: {pInfo.full_name?.split(' ')[0]?.toUpperCase() || 'HERO'}</div>
          <div>SCORE: 99999</div>
          <div>LIVES: ❤️❤️❤️</div>
        </div>

        {/* Hero Character Card */}
        <section className="mb-12 border-4 border-double border-[#FFFF00] p-6 bg-black relative">
          <div className="absolute top-[-14px] left-4 bg-black px-2 text-[#FFFF00] text-[8px] sm:text-[10px]">
            [ HERO INVENTORY ]
          </div>
          
          <h1 className="text-sm sm:text-2xl font-black text-white uppercase mb-4 leading-normal text-center sm:text-left">
            {pInfo.full_name}
          </h1>
          <p className="text-[#FF8800] text-[8px] sm:text-[10px] mb-6 text-center sm:text-left">
            CLASS // {pInfo.main_title?.toUpperCase()}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[8px] sm:text-[10px] text-[#A855F7] leading-loose pt-2 border-t-2 border-[#FFFF00]/20">
            <div>EMAIL: <a href={`mailto:${pInfo.email_id}`} className="text-white hover:underline">{pInfo.email_id}</a></div>
            {pInfo.github_username && <div>GITHUB: <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-white hover:underline">github.com/{pInfo.github_username}</a></div>}
            {pInfo.leetcode_username && <div>LEETCODE: <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-white hover:underline">leetcode.com/{pInfo.leetcode_username}</a></div>}
            {pInfo.address && <div>WORLD: {pInfo.address?.toUpperCase()}</div>}
          </div>
        </section>

        {/* About Dialog Box */}
        <section className="mb-12 border-4 border-white p-6 bg-[#0c0316] relative">
          <div className="absolute top-[-10px] left-4 bg-[#19092E] px-2 text-[#00FFFF] text-[8px]">
            &gt; TALK TO NPC
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 border-2 border-white shrink-0 bg-[#FF007F] text-center text-sm leading-8 flex items-center justify-center">👾</div>
            <div className="flex-1 text-[#00FF00]">
              <p className="mb-4 leading-relaxed text-[8px] sm:text-[10px]">{pInfo.about_paragraph}</p>
              {pInfo.college_name && (
                <div className="border-2 border-[#00FF00] p-4 bg-black text-[8px]">
                  <span className="text-white font-bold block mb-2">TRAINING GROUNDS:</span>
                  <span className="block mb-1">{pInfo.college_name?.toUpperCase()}</span>
                  <span className="text-[#FF8800]">{pInfo.course_name?.toUpperCase()} {pInfo.specialization_course_name && `(${pInfo.specialization_course_name?.toUpperCase()})`}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12 border-4 border-[#FF007F] p-6 bg-black relative">
          <div className="absolute top-[-10px] left-4 bg-[#19092E] px-2 text-[#FF007F] text-[8px]">
            [ SKILLS SPELLS ]
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {tStacks.reduce((acc, curr) => {
              const cat = curr.category || 'Core';
              const found = acc.find(c => c.category === cat);
              if (found) found.skills.push(curr.name);
              else acc.push({ category: cat, skills: [curr.name] });
              return acc;
            }, []).map((catObj, idx) => (
              <div key={idx} className="border-2 border-[#FF007F]/40 p-4">
                <h3 className="text-[#FFFF00] text-[8px] sm:text-[10px] mb-4 border-b-2 border-[#FF007F]/40 pb-2">
                  {catObj.category?.toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {catObj.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-[8px] text-white">
                        <span>{skill?.toUpperCase()}</span>
                        <span>LVL MAX</span>
                      </div>
                      {/* Health bar meter style */}
                      <div className="w-full bg-[#333] border-2 border-white h-4 p-[2px]">
                        <div className="bg-[#00FF00] h-full w-[90%]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12 relative">
          <div className="text-center text-[#FFFF00] text-xs mb-8">
            === QUEST LOG (PROJECTS) ===
          </div>
          
          <div className="space-y-8">
            {projs.map((project, idx) => {
              const tags = Array.isArray(project.project_tech_stack)
                ? project.project_tech_stack
                : typeof project.project_tech_stack === 'string'
                ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [];
              return (
                <div key={idx} className="border-4 border-white p-6 bg-[#0C041C]">
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-white pb-3 mb-4 gap-2">
                    <h3 className="text-white text-xs uppercase">{project.project_name}</h3>
                    <span className="text-[#FF8800] text-[8px]">QUEST 0{idx + 1}</span>
                  </div>
                  {project.project_image && (
                    <div className="mb-4 max-w-sm border-2 border-white overflow-hidden bg-black p-1">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover filter brightness-90 contrast-125" />
                    </div>
                  )}
                  <p className="text-xs text-[#00FF00] mb-2">// QUEST TASK:</p>
                  <p className="text-[#E2DCEB] text-[8px] sm:text-[10px] leading-relaxed mb-4">{project.project_desc}</p>
                  <div className="text-[#FF007F] text-[8px] mb-6">
                    LOOT: {tags.map(t => t.toUpperCase()).join(' | ')}
                  </div>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="bg-[#00FF00] text-black px-4 py-2 hover:bg-[#00CC00] font-bold inline-block text-[8px]">
                      START QUEST
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience Section */}
        {exps.length > 0 && (
          <section className="mb-12 border-4 border-white p-6 bg-black relative">
            <div className="absolute top-[-10px] left-4 bg-[#19092E] px-2 text-[#00FFFF] text-[8px]">
              [ EXPERIENCE GUILD ]
            </div>
            
            <div className="space-y-6 pt-4">
              {exps.map((exp, idx) => (
                <div key={idx} className="border-b-2 border-dashed border-white/20 pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row justify-between text-xs text-white mb-2 gap-2">
                    <span className="text-[#FFFF00]">{exp.role?.toUpperCase()}</span>
                    <span className="text-[#00FF00]">{exp.company_name?.toUpperCase()}</span>
                  </div>
                  <div className="text-[#6272A4] text-[8px] mb-3">TIME: {exp.date_of_joining}</div>
                  <p className="text-[#E0D8EE] text-[8px] sm:text-[10px] leading-relaxed">{exp.work_description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certs.length > 0 && (
          <section className="mb-12">
            <div className="text-center text-[#00FFFF] text-xs mb-8">
              === REWARDS EARNED (CERTIFICATES) ===
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div key={idx} className="border-4 border-white p-4 bg-black flex justify-between items-center text-[8px] sm:text-[10px]">
                  <div>
                    <h3 className="text-white uppercase leading-snug">{cert.certification_name}</h3>
                    <span className="text-[#FF8800] block mt-1">GUILD: {cert.issuing_organization?.toUpperCase()}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="bg-[#FF007F] text-white px-2 py-1 text-[8px] hover:bg-[#FF0055]">
                      CLAIM
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Game Over Footer */}
        <div className="border-t-4 border-white pt-6 flex flex-col sm:flex-row justify-between items-center text-[8px] text-[#6272A4] gap-4">
          <span>&copy; {new Date().getFullYear()} {pInfo.full_name?.toUpperCase()}</span>
          <span>GAME OVER</span>
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="text-[#FFFF00] hover:underline">
              DOWNLOAD CV.ROM
            </a>
          )}
        </div>
      </div>

      {/* Floating game print button */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print ROM (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-[#FF007F] hover:bg-[#FF0055] text-white font-bold uppercase tracking-wider text-[8px] border-2 border-white shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>PRINT ROM</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template13;
