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

const Template11 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap';
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
      <div className="min-h-screen bg-[#F3EFEB] flex items-center justify-center text-[#1E1E1D] font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-wider text-sm italic">Pressing Today's Edition...</p>
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

  const firstLetter = pInfo.about_paragraph?.charAt(0) || 'I';
  const remainingAbout = pInfo.about_paragraph?.slice(1) || '';

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1F1E] font-['PT_Serif'] p-6 sm:p-12 relative selection:bg-black selection:text-[#FAF6F0]">
      
      {!portfolioId && !location.state && !isPublicView && (
        <div className="border-y border-black py-1.5 text-center text-xs font-bold tracking-widest uppercase mb-8">
          *** PUBLIC ARCHIVE SAMPLE PREVIEW // DATA FIELD COMPILATION REQUIRED ***
        </div>
      )}

      <div className="max-w-6xl mx-auto border-t-4 border-b-4 border-black py-8 relative">
        
        {/* Newspaper Title Banner */}
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <div className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-[#1F1F1E]/70 mb-2">
            THE PROFESSIONAL RECORD &bull; EST. {new Date().getFullYear() - 5}
          </div>
          <h1 className="font-['Cinzel'] text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none text-[#1F1F1E]">
            {pInfo.full_name?.toUpperCase() || 'THE CHRONICLE'}
          </h1>
          <div className="mt-4 border-t border-black/40 pt-4 flex flex-col sm:flex-row justify-between text-xs font-bold uppercase tracking-wider gap-2">
            <span>Vol. X &bull; No. {data.id ? data.id.substring(0,4) : '777'}</span>
            <span className="italic font-serif font-normal lowercase">edition detailing software engineering systems</span>
            <span>Price: One Resume</span>
          </div>
        </div>

        {/* Hero Headline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-black pb-8">
          <div className="lg:col-span-8 border-r border-black/20 pr-0 lg:pr-8">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-5xl font-extrabold leading-tight text-[#1F1F1E] mb-6">
              {pInfo.main_title?.toUpperCase()} SELECTED AS TOP TALENT
            </h2>
            <div className="text-sm leading-relaxed text-[#1F1F1E]/90 text-justify">
              <span className="float-left text-6xl md:text-7xl font-bold font-['Cinzel'] leading-[0.8] mt-1 mr-3 text-black border border-black p-2 bg-[#F3EFEB] shadow-[2px_2px_0px_#000]">
                {firstLetter}
              </span>
              <p>{remainingAbout}</p>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between text-xs gap-4 font-sans text-[#1F1F1E]/80">
            <div>
              <h3 className="font-['Cinzel'] text-sm font-bold text-black border-b border-black pb-1 mb-3">CONTACT DETAILS</h3>
              <p className="mb-2"><span className="font-bold">EMAIL:</span> {pInfo.email_id}</p>
              {pInfo.address && <p className="mb-2"><span className="font-bold">LOCATION:</span> {pInfo.address}</p>}
              {pInfo.college_name && (
                <p className="mb-2"><span className="font-bold">INSTITUTION:</span> {pInfo.college_name}</p>
              )}
              {pInfo.course_name && (
                <p className="mb-2"><span className="font-bold">PROGRAM:</span> {pInfo.course_name} {pInfo.specialization_course_name && `(${pInfo.specialization_course_name})`}</p>
              )}
            </div>
            
            <div className="border-t border-black/30 pt-4">
              <h3 className="font-['Cinzel'] text-xs font-bold text-black mb-2">TELEGRAPHIC LINKS</h3>
              {pInfo.github_username && (
                <p className="mb-1">GITHUB: <a href={`https://github.com/${pInfo.github_username}`} target="_blank" rel="noreferrer" className="underline font-bold text-black">/{pInfo.github_username}</a></p>
              )}
              {pInfo.leetcode_username && (
                <p className="mb-1">LEETCODE: <a href={`https://leetcode.com/${pInfo.leetcode_username}`} target="_blank" rel="noreferrer" className="underline font-bold text-black">/{pInfo.leetcode_username}</a></p>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="py-8 border-b border-black">
          <h2 className="font-['Cinzel'] text-xl font-bold text-black border-b-2 border-black pb-2 mb-6 tracking-wide text-center">
            SPECIAL TECHNICAL DISPATCHES (CORE SKILLS)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tStacks.reduce((acc, curr) => {
              const cat = curr.category || 'General';
              const found = acc.find(c => c.category === cat);
              if (found) found.skills.push(curr.name);
              else acc.push({ category: cat, skills: [curr.name] });
              return acc;
            }, []).map((catObj, idx) => (
              <div key={idx} className="border border-black/40 p-4 bg-[#F5F1E8]">
                <h3 className="font-['Cinzel'] text-xs font-black text-black border-b border-black pb-1 mb-3">
                  SECT. {idx + 1} &bull; {catObj.category.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-[#1F1F1E]/80">
                  {catObj.skills.map((skill, sIdx) => (
                    <span key={sIdx}>&bull; {skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="py-8 border-b border-black">
          <h2 className="font-['Cinzel'] text-xl font-bold text-black border-b-2 border-black pb-2 mb-8 tracking-wide text-center">
            SELECTED ACCOMPLISHMENTS & INVESTIGATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projs.map((project, idx) => {
              const tags = Array.isArray(project.project_tech_stack)
                ? project.project_tech_stack
                : typeof project.project_tech_stack === 'string'
                ? project.project_tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [];
              return (
                <div key={idx} className="border-r border-black/10 pr-0 md:pr-4 last:border-0">
                  {project.project_image && (
                    <div className="mb-4 border border-black p-1 bg-white">
                      <img src={project.project_image} alt={project.project_name} className="w-full h-auto filter grayscale contrast-125" />
                    </div>
                  )}
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-black mb-2 uppercase">
                    {project.project_name}
                  </h3>
                  <p className="text-xs text-[#1F1F1E]/70 mb-3 italic">
                    Keywords: {tags.join(', ')}
                  </p>
                  <p className="text-sm leading-relaxed text-[#1F1F1E]/90 text-justify mb-4">
                    {project.project_desc}
                  </p>
                  {project.project_github_link && (
                    <a href={project.project_github_link} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:text-[#1F1F1E]/75">
                      Verify Dispatch Registry &rarr;
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Section */}
        {exps.length > 0 && (
          <div className="py-8 border-b border-black">
            <h2 className="font-['Cinzel'] text-xl font-bold text-black border-b-2 border-black pb-2 mb-6 tracking-wide text-center">
              RECORDED ANTECEDENTS (EXPERIENCE)
            </h2>
            <div className="space-y-6">
              {exps.map((exp, idx) => (
                <div key={idx} className="border-b border-black/10 pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-black">
                      {exp.role?.toUpperCase()} &mdash; <span className="font-normal italic">{exp.company_name}</span>
                    </h3>
                    <span className="text-xs font-bold uppercase font-sans text-black border border-black px-2 py-0.5">
                      JOINED {exp.date_of_joining}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#1F1F1E]/95 text-justify">
                    {exp.work_description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certs.length > 0 && (
          <div className="py-8">
            <h2 className="font-['Cinzel'] text-xl font-bold text-black border-b-2 border-black pb-2 mb-6 tracking-wide text-center">
              AUTHENTICATED CERTIFICATES OF COMPETENCY
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certs.map((cert, idx) => (
                <div key={idx} className="border border-black/35 p-4 bg-[#F5F1E8] flex justify-between items-center">
                  <div>
                    <h3 className="font-['Playfair_Display'] text-sm font-bold text-black uppercase leading-tight">{cert.certification_name}</h3>
                    <span className="text-xs font-serif opacity-75 block mt-1">Issued by: {cert.issuing_organization}</span>
                  </div>
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:border-black/50 ml-4 shrink-0">
                      Telegraph
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>

      {/* Newspaper Footer */}
      <footer className="max-w-6xl mx-auto py-8 text-center text-xs opacity-65 font-serif border-t border-black/40 mt-12">
        <p>&copy; {new Date().getFullYear()} {pInfo.full_name}. Prepared for general dissemination.</p>
      </footer>

      {/* PDF Floating print button */}
      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Print to Broadsheet (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-black border border-black hover:bg-black/80 text-white font-bold uppercase tracking-wider text-[10px] shadow-2xl flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Print Broadsheet</span>
        </button>
      )}

      {!isPublicView && portfolioId && pInfo.full_name && (
        <ChatbotWidget portfolioId={portfolioId} name={pInfo.full_name} />
      )}
    </div>
  );
};

export default Template11;
