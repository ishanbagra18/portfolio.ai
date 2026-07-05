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

const Template10 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap';
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
      <div className="min-h-screen bg-[#F0F4F1] flex items-center justify-center text-[#2E3C2B] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#4B5F43] border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-wider text-sm font-serif italic">Loading Botanical Oasis...</p>
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
    <div className="min-h-screen bg-[#F8F9F6] text-[#2E3C2B] font-['Lora'] relative overflow-x-hidden selection:bg-[#4B5F43] selection:text-[#F8F9F6]">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#4B5F43]/10 border-b border-[#4B5F43]/20 text-[#4B5F43] px-4 py-2 text-center text-xs font-semibold tracking-wide">
          🍃 Viewing botanical preview mode. Fill out details to make it your own!
        </div>
      )}

      {/* Decorative leaf shapes */}
      <div className="absolute top-[2%] right-[-5%] w-64 h-64 bg-[#E2ECE5]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] left-[-8%] w-80 h-80 bg-[#E8EAE3] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-10 flex justify-between items-center relative z-10">
        <span className="font-['Playfair_Display'] text-2xl font-bold italic text-[#394934]">
          {pInfo.full_name?.split(' ')[0] || 'Oasis'}.
        </span>
        <div className="flex gap-6 text-sm text-[#4B5F43] font-medium">
          {pInfo.github_username && (
            <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="hover:text-[#394934] transition-colors">GitHub</a>
          )}
          {pInfo.leetcode_username && (
            <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="hover:text-[#394934] transition-colors">LeetCode</a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center relative z-10">
        <div className="w-20 h-20 bg-[#E2ECE5] border border-[#C5D3C9] rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-2xl">🌱</span>
        </div>
        <h1 className="font-['Playfair_Display'] text-4xl sm:text-7xl font-bold tracking-tight text-[#253221] mb-6 max-w-4xl mx-auto leading-[1.1]">
          Designing digital ecosystems. I am <span className="italic font-normal text-[#4B5F43]">{pInfo.full_name}</span>.
        </h1>
        <p className="text-base sm:text-lg text-[#556650] max-w-xl mx-auto mb-10 leading-relaxed font-light">
          {pInfo.main_title}
        </p>
        <div className="flex justify-center gap-4">
          {pInfo.resume_url && (
            <a href={pInfo.resume_url} target="_blank" rel="noreferrer" className="px-7 py-3 bg-[#4B5F43] hover:bg-[#3D4F36] text-[#F8F9F6] font-medium rounded-full transition-all duration-300 transform hover:-translate-y-0.5">
              Read Résumé
            </a>
          )}
          <a href={`mailto:${pInfo.email_id}`} className="px-7 py-3 border border-[#4B5F43]/40 hover:bg-[#EAECE6] text-[#4B5F43] font-medium rounded-full transition-all">
            Get in touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="bg-[#EAECE6] border border-[#D5D8CD] rounded-[2.5rem] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase font-bold text-[#4B5F43] tracking-widest block mb-2">My Story</span>
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#253221]">Behind the work.</h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-base sm:text-lg text-[#40503B] leading-relaxed font-light mb-8">
                {pInfo.about_paragraph}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#D5D8CD] text-xs text-[#556650]">
                {pInfo.college_name && (
                  <div>
                    <span className="uppercase tracking-wider font-bold block mb-1">Alma Mater</span>
                    <span className="text-[#253221] font-semibold text-sm block">{pInfo.college_name}</span>
                    <span className="block mt-0.5">{pInfo.course_name} {pInfo.specialization_course_name && `in ${pInfo.specialization_course_name}`}</span>
                  </div>
                )}
                {pInfo.address && (
                  <div>
                    <span className="uppercase tracking-wider font-bold block mb-1">Base Location</span>
                    <span className="text-[#253221] font-semibold text-sm block">{pInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-center text-[#253221] mb-16">Areas of Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tStacks.reduce((acc, curr) => {
            const cat = curr.category || 'General';
            const found = acc.find(c => c.category === cat);
            if (found) found.skills.push(curr.name);
            else acc.push({ category: cat, skills: [curr.name] });
            return acc;
          }, []).map((catObj, idx) => (
            <div key={idx} className="bg-white border border-[#EAECE6] rounded-[2rem] p-8 shadow-sm">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#394934] mb-6 border-b border-[#F0F4F1] pb-2">
                {catObj.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {catObj.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-3.5 py-1.5 bg-[#F4F6F2] text-[#4B5F43] rounded-full text-xs font-medium border border-[#EBECE8]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-center text-[#253221] mb-16">Crafted Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projs.map((project, idx) => {
            const tags = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === 'string'
              ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
              : [];
            return (
              <div key={idx} className="bg-white border border-[#EAECE6] rounded-[2.5rem] p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  {project.project_image && (
                    <div className="mb-6 rounded-[2rem] overflow-hidden aspect-video bg-[#F4F6F2] flex items-center justify-center border border-[#EAECE6]">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-full object-cover filter brightness-[0.98]" />
                    </div>
                  )}
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#253221] mb-3">{project.project_name}</h3>
                  <p className="text-[#556650] text-sm leading-relaxed mb-6 font-light">{project.project_desc}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2.5 py-1 bg-[#F4F6F2] text-[#556650] rounded-full text-xs font-light border border-[#EBECE8]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4B5F43] hover:text-[#394934]">
                      Explore Code Base &rarr;
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
        <section className="max-w-5xl mx-auto px-6 py-20 relative z-10">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-center text-[#253221] mb-16">Chronological History</h2>
          <div className="space-y-6">
            {exps.map((exp, idx) => (
              <div key={idx} className="bg-[#EAECE6] border border-[#D5D8CD] rounded-[2rem] p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#253221]">{exp.role}</h3>
                  <span className="text-sm font-semibold text-[#4B5F43] block mt-1">{exp.company_name}</span>
                  <p className="text-[#40503B] text-sm mt-4 font-light leading-relaxed max-w-2xl">{exp.work_description}</p>
                </div>
                <div className="text-xs font-medium text-[#4B5F43] bg-white px-4 py-1.5 border border-[#D5D8CD] rounded-full self-start shrink-0">
                  Since {exp.date_of_joining}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certs.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 relative z-10">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-center text-[#253221] mb-16">Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((cert, idx) => (
              <div key={idx} className="bg-white border border-[#EAECE6] rounded-[2rem] p-6 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#253221] leading-snug">{cert.certification_name}</h3>
                  <span className="text-xs text-[#556650] block mt-1">From {cert.issuing_organization}</span>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noreferrer" className="p-3 bg-[#F4F6F2] hover:bg-[#EAECE6] border border-[#EBECE8] rounded-full text-[#4B5F43] transition-all shrink-0 ml-4">
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
      <footer className="border-t border-[#EAECE6] bg-white py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-[#556650]">
          <p>&copy; {new Date().getFullYear()} {pInfo.full_name}.</p>
          <p className="italic font-serif">Cultivated with Sage Botanical Theme</p>
        </div>
      </footer>

      {/* Print Trigger */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print to PDF"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-[#4B5F43] hover:bg-[#3D4F36] text-[#F8F9F6] font-bold uppercase tracking-wider text-[10px] rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
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

export default Template10;
