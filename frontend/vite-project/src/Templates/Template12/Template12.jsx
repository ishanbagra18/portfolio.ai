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

const Template12 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Montserrat:wght@400;700;900&display=swap';
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
      <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center text-black font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest text-sm font-bold uppercase">STRUCTURING SWISS GRID...</p>
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
    <div className="min-h-screen bg-[#F0EFF0] text-black font-['Montserrat'] relative overflow-x-hidden selection:bg-[#E63946] selection:text-white pb-20">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#E63946] text-white py-2 text-center text-xs font-black tracking-widest uppercase relative z-50">
          SWISS GRID PREVIEW // SAMPLE DATA RENDERED
        </div>
      )}

      {/* Massive Left Border Line */}
      <div className="absolute top-0 bottom-0 left-6 sm:left-12 w-2 bg-[#E63946] hidden md:block" />

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 md:px-24 py-12 flex justify-between items-center relative z-10 border-b-4 border-black">
        <span className="font-['Unbounded'] text-2xl font-black uppercase tracking-tighter bg-black text-white px-3 py-1">
          {pInfo.full_name?.split(' ')[0] || 'SWISS'}.
        </span>
        <div className="flex gap-4 font-black uppercase text-xs">
          {pInfo.github_username && (
            <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="hover:text-[#E63946] transition-colors">GitHub</a>
          )}
          {pInfo.leetcode_username && (
            <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="hover:text-[#E63946] transition-colors">LeetCode</a>
          )}
        </div>
      </header>

      {/* Hero Layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-24 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="bg-[#E63946] text-white text-xs font-black tracking-widest py-1 px-3 self-start uppercase mb-6">
            DEVELOPMENT & INTEGRATION
          </div>
          <h1 className="font-['Unbounded'] text-5xl sm:text-8xl font-black leading-none uppercase tracking-tight text-black mb-8">
            {pInfo.full_name}
          </h1>
          <p className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black/70 mb-10 max-w-2xl">
            {pInfo.main_title}
          </p>
          <div className="flex gap-4 flex-wrap">
            {pInfo.resume_url && (
              <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-8 py-4 bg-black text-white hover:bg-[#E63946] font-black uppercase text-xs tracking-widest transition-colors duration-300">
                GET RESUME.PDF
              </a>
            )}
            <a href={`mailto:${pInfo.email_id}`} className="px-8 py-4 border-4 border-black hover:bg-black hover:text-white font-black uppercase text-xs tracking-widest transition-all">
              INITIATE CONTACT
            </a>
          </div>
        </div>

        {/* Diagonal constructivist red block */}
        <div className="lg:col-span-4 bg-black text-white p-8 flex flex-col justify-between border-b-8 border-[#E63946] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E63946] transform translate-x-10 -translate-y-10 rotate-45" />
          <div>
            <span className="text-xs uppercase font-black text-[#E63946] block mb-6 tracking-widest">// ARCHIVE DETAILS</span>
            <div className="space-y-4 text-xs font-black tracking-wider">
              {pInfo.email_id && <p>MAIL: {pInfo.email_id}</p>}
              {pInfo.address && <p>BASE: {pInfo.address}</p>}
              {pInfo.college_name && <p>INST: {pInfo.college_name}</p>}
              {pInfo.course_name && <p>DEGR: {pInfo.course_name}</p>}
            </div>
          </div>
          <div className="text-right text-6xl font-['Unbounded'] font-black text-[#E63946] leading-none select-none opacity-40">
            01
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-24 py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 border-t-4 border-black">
        <div className="lg:col-span-4 flex items-start">
          <h2 className="font-['Unbounded'] text-4xl font-black uppercase text-black leading-none tracking-tighter">
            THE PROFILE
          </h2>
        </div>
        <div className="lg:col-span-8">
          <p className="text-lg sm:text-xl font-bold leading-relaxed text-black/80 mb-6 text-justify">
            {pInfo.about_paragraph}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-24 py-16 relative z-10 border-t-4 border-black">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="font-['Unbounded'] text-4xl font-black uppercase text-black leading-none tracking-tighter">
            SYSTEM INDEX
          </h2>
          <span className="text-xs font-black uppercase tracking-widest text-[#E63946]">// STACKS</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-4 border-black bg-black">
          {tStacks.reduce((acc, curr) => {
            const cat = curr.category || 'OTHER';
            const found = acc.find(c => c.category === cat);
            if (found) found.skills.push(curr.name);
            else acc.push({ category: cat, skills: [curr.name] });
            return acc;
          }, []).map((catObj, idx) => (
            <div key={idx} className="bg-[#F0EFF0] p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-['Unbounded'] text-lg font-black text-black uppercase mb-6 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#E63946] inline-block" />
                  {catObj.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catObj.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-5xl font-['Unbounded'] font-black text-black/10 mt-12 self-end leading-none">0{idx+1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-24 py-16 relative z-10 border-t-4 border-black">
        <div className="mb-16">
          <h2 className="font-['Unbounded'] text-4xl font-black uppercase text-black leading-none tracking-tighter">
            WORKS ARCHIVE
          </h2>
        </div>

        <div className="space-y-12">
          {projs.map((project, idx) => {
            const tags = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === 'string'
              ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
              : [];
            return (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b-4 border-black pb-12 last:border-0 last:pb-0">
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-['Unbounded'] font-black text-[#E63946] leading-none block mb-4">N&deg; 0{idx+1}</span>
                    <h3 className="font-['Unbounded'] text-2xl font-black uppercase text-black mb-4">
                      {project.project_name}
                    </h3>
                  </div>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black border-4 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors self-start mt-4">
                      EXPLORE REPO
                    </a>
                  )}
                </div>
                
                <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                  {project.project_image && (
                    <div className="border-4 border-black overflow-hidden aspect-video bg-black max-w-lg">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-full object-cover filter contrast-125" />
                    </div>
                  )}
                  <p className="text-sm font-bold leading-relaxed text-black/80">{project.project_desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-black uppercase tracking-widest text-[#E63946] border border-[#E63946] px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Section */}
      {exps.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-24 py-16 relative z-10 border-t-4 border-black">
          <div className="mb-12">
            <h2 className="font-['Unbounded'] text-4xl font-black uppercase text-black leading-none tracking-tighter">
              CHRONOLOGY
            </h2>
          </div>
          
          <div className="space-y-6">
            {exps.map((exp, idx) => (
              <div key={idx} className="bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 border-l-8 border-[#E63946]">
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Unbounded'] text-lg font-black uppercase text-[#E63946] leading-tight mb-2">{exp.role}</h3>
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">{exp.company_name}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#E63946] bg-white/10 px-3 py-1.5 self-start uppercase mt-4">
                    JOIN: {exp.date_of_joining}
                  </span>
                </div>
                <div className="lg:col-span-8 flex items-center text-sm text-white/80 leading-relaxed font-bold">
                  {exp.work_description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-24 py-16 relative z-10 border-t-4 border-black">
          <div className="mb-12">
            <h2 className="font-['Unbounded'] text-4xl font-black uppercase text-black leading-none tracking-tighter">
              CREDENTIALS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert, idx) => (
              <div key={idx} className="border-4 border-black p-6 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-['Unbounded'] text-sm font-black uppercase leading-tight text-black">{cert.certification_name}</h3>
                  <span className="text-xs font-black uppercase tracking-wider text-black/50 block mt-1">{cert.issuing_organization}</span>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#E63946] hover:bg-black text-white font-black text-xs uppercase shrink-0 transition-colors ml-4">
                    VERIFY
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-24 py-12 border-t-4 border-black mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} {pInfo.full_name}</p>
          <p className="text-[#E63946]">SWISS DESIGN COMPLIANT</p>
        </div>
      </footer>

      {/* PDF Action */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print (PDF)"
          className="fixed top-6 left-6 z-[9999] px-6 py-3 bg-black hover:bg-[#E63946] text-white font-black uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-2 border-2 border-white transition-all print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>DOWNLOAD PDF</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template12;
