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

const Template15 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800;900&display=swap';
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
      <div className="min-h-screen bg-[#E8E8FD] flex items-center justify-center text-[#3C3A62] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#8280FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-wider text-sm font-bold">Inflating Claymorphic Bubble...</p>
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
    <div className="min-h-screen bg-[#EEEDFB] text-[#3C3A62] font-['Nunito'] p-6 sm:p-12 relative overflow-x-hidden selection:bg-[#8280FF] selection:text-white pb-20">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#8280FF] text-white py-2.5 text-center text-xs font-black tracking-wider rounded-2xl mb-8 shadow-md">
          🌸 Soft Clay Preview Mode. Add details to render your own.
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Header */}
        <header className="bg-white rounded-3xl p-6 border border-[#DCDCF6] shadow-[5px_5px_15px_rgba(170,170,225,0.2),_inset_3px_3px_6px_rgba(255,255,255,0.7)] flex justify-between items-center">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-[#8280FF] to-[#A5A4FF] bg-clip-text text-transparent">
            {pInfo.full_name?.split(' ')[0] || 'Clay'}.
          </span>
          <div className="flex gap-4 text-xs font-extrabold uppercase">
            {pInfo.github_username && (
              <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-[#8280FF] hover:text-[#5B5AFF] transition-colors">GitHub</a>
            )}
            {pInfo.leetcode_username && (
              <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-[#8280FF] hover:text-[#5B5AFF] transition-colors">LeetCode</a>
            )}
          </div>
        </header>

        {/* Hero Character Card */}
        <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-[#DCDCF6] shadow-[8px_8px_20px_rgba(170,170,225,0.25),_inset_4px_4px_8px_rgba(255,255,255,0.85)] flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-center md:text-left flex-1">
            <div className="inline-block px-3 py-1 bg-[#EEEDFB] text-[#8280FF] text-xs font-bold rounded-full mb-4">
              ✨ Welcome to my space!
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#2B2947] mb-4 leading-none">
              Hi, I'm {pInfo.full_name}
            </h1>
            <p className="text-base sm:text-lg text-[#6E6B8D] mb-8 font-semibold">
              {pInfo.main_title}
            </p>
            <div className="flex justify-center md:justify-start gap-4 flex-wrap">
              {pInfo.resume_url && (
                <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-[#8280FF] hover:bg-[#6866E5] text-white font-extrabold rounded-2xl shadow-[4px_4px_10px_rgba(130,128,255,0.3),_inset_2px_2px_4px_rgba(255,255,255,0.3)] transition-colors duration-300">
                  Résumé
                </a>
              )}
              <a href={`mailto:${pInfo.email_id}`} className="px-8 py-3.5 bg-[#EEEDFB] hover:bg-[#E1E0F8] text-[#8280FF] font-extrabold rounded-2xl border border-[#DCDCF6] transition-colors">
                Say Hello
              </a>
            </div>
          </div>

          <div className="w-40 h-40 bg-[#EEEDFB] rounded-full border border-[#DCDCF6] flex items-center justify-center text-5xl shadow-[inset_4px_4px_8px_rgba(170,170,225,0.4),_4px_4px_10px_rgba(255,255,255,0.8)]">
            🦄
          </div>
        </section>

        {/* About Section */}
        <section className="bg-[#EEEDFB] rounded-[2.5rem] p-8 sm:p-12 border border-[#DCDCF6] shadow-[inset_5px_5px_12px_rgba(170,170,225,0.3),_5px_5px_15px_rgba(255,255,255,0.8)]">
          <h2 className="text-2xl font-black text-[#2B2947] mb-6">About Me</h2>
          <p className="text-[#565377] leading-relaxed mb-8 text-base">
            {pInfo.about_paragraph}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#DCDCF6] text-xs text-[#6E6B8D]">
            {pInfo.college_name && (
              <div>
                <span className="font-extrabold block mb-1 uppercase tracking-wider text-[10px]">Academic Journey</span>
                <span className="text-[#2B2947] font-extrabold text-sm block">{pInfo.college_name}</span>
                <span className="block mt-0.5">{pInfo.course_name} {pInfo.specialization_course_name && `in ${pInfo.specialization_course_name}`}</span>
              </div>
            )}
            {pInfo.address && (
              <div>
                <span className="font-extrabold block mb-1 uppercase tracking-wider text-[10px]">Current Port</span>
                <span className="text-[#2B2947] font-extrabold text-sm block">{pInfo.address}</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-[#2B2947] text-center">My Power Stacks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tStacks.reduce((acc, curr) => {
              const cat = curr.category || 'General';
              const found = acc.find(c => c.category === cat);
              if (found) found.skills.push(curr.name);
              else acc.push({ category: cat, skills: [curr.name] });
              return acc;
            }, []).map((catObj, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-[#DCDCF6] shadow-[5px_5px_15px_rgba(170,170,225,0.2),_inset_3px_3px_6px_rgba(255,255,255,0.7)] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#8280FF] mb-4 uppercase tracking-wider">
                    {catObj.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {catObj.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-3.5 py-1.5 bg-[#EEEDFB] text-[#8280FF] rounded-full text-xs font-bold border border-[#E1E0F8]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-[#2B2947] text-center">Projects I've Built</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projs.map((project, idx) => {
              const tags = Array.isArray(project.project_tech_stack)
                ? project.project_tech_stack
                : typeof project.project_tech_stack === 'string'
                ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [];
              return (
                <div key={idx} className="bg-white rounded-[2rem] p-6 border border-[#DCDCF6] shadow-[5px_5px_15px_rgba(170,170,225,0.2),_inset_3px_3px_6px_rgba(255,255,255,0.7)] flex flex-col justify-between">
                  <div>
                    {project.project_image && (
                      <div className="mb-4 rounded-2xl overflow-hidden aspect-video bg-[#EEEDFB] flex items-center justify-center border border-[#DCDCF6]">
                        <img src={project.project_image} alt={project.project_name} className="w-full h-full object-cover filter brightness-[0.98]" />
                      </div>
                    )}
                    <h3 className="text-xl font-black text-[#2B2947] mb-2">{project.project_name}</h3>
                    <p className="text-[#6E6B8D] text-xs leading-relaxed mb-6 font-semibold">{project.project_desc}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 bg-[#EEEDFB] text-[#6E6B8D] rounded-full text-[10px] font-bold border border-[#E1E0F8]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.project_github_link && (
                      <a href={project.project_github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#8280FF] hover:text-[#5B5AFF]">
                        Explore Source &rarr;
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience Section */}
        {exps.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-[#2B2947] text-center">My Experiences</h2>
            
            <div className="space-y-6">
              {exps.map((exp, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCDCF6] shadow-[5px_5px_15px_rgba(170,170,225,0.2),_inset_3px_3px_6px_rgba(255,255,255,0.7)] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#2B2947]">{exp.role}</h3>
                    <span className="text-xs font-extrabold text-[#8280FF] block mt-0.5">{exp.company_name}</span>
                    <p className="text-[#6E6B8D] text-xs mt-4 font-semibold leading-relaxed max-w-xl">{exp.work_description}</p>
                  </div>
                  <div className="text-xs font-extrabold text-[#8280FF] bg-[#EEEDFB] px-4 py-1.5 border border-[#DCDCF6] rounded-full self-start shrink-0">
                    Joined: {exp.date_of_joining}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certs.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-[#2B2947] text-center">Certificates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-6 border border-[#DCDCF6] shadow-[5px_5px_15px_rgba(170,170,225,0.2),_inset_3px_3px_6px_rgba(255,255,255,0.7)] flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-[#2B2947] leading-snug">{cert.certification_name}</h3>
                    <span className="text-xs text-[#6E6B8D] font-bold block mt-1">Issued by: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="p-3 bg-[#EEEDFB] hover:bg-[#E1E0F8] border border-[#DCDCF6] rounded-full text-[#8280FF] transition-all shrink-0 ml-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto py-10 text-center text-xs text-[#6E6B8D] border-t border-[#DCDCF6] mt-20">
        <p>&copy; {new Date().getFullYear()} {pInfo.full_name}. Made with Soft Claymorphism.</p>
      </footer>

      {/* PDF Action */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print ROM (PDF)"
          className="fixed top-6 left-6 z-[9999] px-5 py-3 bg-[#8280FF] hover:bg-[#6866E5] text-white font-extrabold rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Save PDF</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template15;
