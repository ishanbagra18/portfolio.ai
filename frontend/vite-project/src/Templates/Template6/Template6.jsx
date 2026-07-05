import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Footer from './components/Footer';
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
    },
    {
      project_name: "ZeroGrid",
      project_desc: "A hybrid renewable energy generation solution developed for the Smart India Hackathon 2025.",
      project_tech_stack: ["React", "Node.js", "Express"],
      project_github_link: "https://github.com/ishanbagra/zerogrid"
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

const Template6 = ({ publicData, isPublicView }) => {
  const location = useLocation();
  const { portfolioId } = useParams();

  const [portfolioData, setPortfolioData] = useState(publicData || location.state || null);
  const [loading, setLoading] = useState(!publicData && !location.state);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&display=swap';
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
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center text-[#1B1B1B] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#1F4D3A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 tracking-wider text-sm font-serif italic">Loading Editorial...</p>
        </div>
      </div>
    );
  }

  const data = portfolioData || defaultData;

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B] font-sans selection:bg-[#1F4D3A] selection:text-[#F7F4EE]">
      {!portfolioId && !location.state && !isPublicView && (
        <div className="bg-[#1F4D3A]/10 border-b border-[#1F4D3A]/20 text-[#1F4D3A] px-4 py-2 text-center text-xs font-semibold tracking-wide">
          ✨ You are currently viewing the live sample preview. Provide your data to generate your own!
        </div>
      )}

      {data?.personalInfo && <Hero data={data.personalInfo} />}
      {data?.personalInfo && <About data={data.personalInfo} />}
      {data?.techStacks && <Skills data={data.techStacks} />}
      {data?.projects && <Projects data={data.projects} />}
      {data?.experiences && <Experience data={data.experiences} />}
      {data?.certifications && <Certifications data={data.certifications} />}
      {data?.personalInfo && <Footer data={data.personalInfo} />}

      {!isPublicView && portfolioId && (
        <button
          onClick={() => window.print()}
          title="Download as Resume (PDF)"
          className="fixed top-6 left-6 z-[9999] px-4 py-2.5 bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800 text-slate-100 font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-2xl backdrop-blur flex items-center gap-1.5 cursor-pointer transition-all duration-300 print:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Download PDF</span>
        </button>
      )}

      {!isPublicView && portfolioId && data?.personalInfo && (
        <ChatbotWidget portfolioId={portfolioId} name={data.personalInfo.full_name} />
      )}
    </div>
  );
};

export default Template6;