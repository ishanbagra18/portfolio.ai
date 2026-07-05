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

const Template7 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@400;500;600&display=swap';
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
      <div className="min-h-screen bg-[#0a051b] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-300 tracking-wider text-sm uppercase">Loading Dreamy Glass...</p>
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

  // Group tech stacks by category
  const categorizedSkills = tStacks.reduce((acc, curr) => {
    const cat = curr.category || 'Other Skills';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr.name);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a051b] text-white font-['Outfit'] relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background glowing spheres */}
      <div className="absolute top-[5%] left-[-10%] w-[45vw] h-[45vw] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[40vw] h-[40vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-gradient-to-r from-indigo-500/35 to-cyan-500/35 border-b border-white/10 text-cyan-200 px-4 py-2 text-center text-xs font-semibold tracking-wider relative z-50">
          ✨ Viewing Live Sample Preview. Add your details to create yours!
        </div>
      )}

      {/* Navigation / Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
          {pInfo.full_name?.split(' ')[0] || 'Portfolio'}.
        </span>
        <div className="flex gap-4">
          {pInfo.github_username && (
            <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="text-white/60 hover:text-cyan-400 transition-colors text-sm font-medium">GitHub</a>
          )}
          {pInfo.leetcode_username && (
            <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="text-white/60 hover:text-fuchsia-400 transition-colors text-sm font-medium">LeetCode</a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-cyan-300 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Available for Hire
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-6">
          Hi, I am <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">{pInfo.full_name}</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          {pInfo.main_title}
        </p>
        <div className="flex justify-center gap-4">
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5">
              View Résumé
            </a>
          )}
          <a href={`mailto:${pInfo.email_id}`} className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold rounded-full backdrop-blur-sm transition-all">
            Get In Touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 text-xs font-mono text-cyan-400/40">// PROFILE INFO</div>
          <h2 className="text-3xl font-bold mb-6 text-cyan-300 uppercase tracking-wider">About Me</h2>
          <p className="text-white/80 text-lg leading-relaxed font-light mb-8">
            {pInfo.about_paragraph}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10 text-white/70 text-sm">
            {pInfo.college_name && (
              <div>
                <span className="block text-white/40 font-medium uppercase text-xs tracking-widest mb-1">Education</span>
                <span className="font-semibold text-white">{pInfo.college_name}</span>
                <span className="block">{pInfo.course_name} {pInfo.specialization_course_name && `in ${pInfo.specialization_course_name}`}</span>
              </div>
            )}
            {pInfo.address && (
              <div>
                <span className="block text-white/40 font-medium uppercase text-xs tracking-widest mb-1">Location</span>
                <span className="font-semibold text-white">{pInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-cyan-300 uppercase tracking-wider">Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.keys(categorizedSkills).map((category, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/10 transition-colors shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-fuchsia-400 border-b border-white/10 pb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorizedSkills[category].map((skill, sIdx) => (
                  <span key={sIdx} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-cyan-300 uppercase tracking-wider">Selected Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projs.map((project, idx) => {
            const tags = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === 'string'
              ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
              : [];
            return (
              <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group shadow-xl">
                <div>
                  {project.project_image && (
                    <div className="mb-6 rounded-2xl overflow-hidden aspect-video bg-white/5 flex items-center justify-center border border-white/10">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">{project.project_name}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">{project.project_desc}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm">
                      View Code 
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
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
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16 text-cyan-300 uppercase tracking-wider">Experience</h2>
          <div className="space-y-8">
            {exps.map((exp, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                  <span className="text-sm font-semibold text-fuchsia-400 block mt-1">{exp.company_name}</span>
                  <p className="text-white/70 text-sm mt-4 font-light leading-relaxed max-w-2xl">{exp.work_description}</p>
                </div>
                <div className="text-white/40 text-xs font-mono shrink-0 uppercase tracking-wider bg-white/5 px-3 py-1.5 border border-white/10 rounded-full self-start">
                  Joined: {exp.date_of_joining}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certs.length > 0 && (
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16 text-cyan-300 uppercase tracking-wider">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md flex justify-between items-center hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">{cert.certification_name}</h3>
                  <span className="text-xs text-white/50 font-medium block mt-1">{cert.issuing_organization}</span>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-all shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} {pInfo.full_name}. All rights reserved.</p>
          <p className="text-xs text-white/30 tracking-wider">Designed with Aurora Glass</p>
        </div>
      </footer>

      {/* PDF Action */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Download as Resume (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-100 font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-2xl backdrop-blur flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
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

export default Template7;
