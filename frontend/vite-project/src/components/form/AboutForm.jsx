import { API_BASE } from '../../lib/api';
import React, { useState } from 'react';

const AboutForm = ({ data, onChange }) => {
  const [polishing, setPolishing] = useState(false);

  const handlePolish = async () => {
    const textToPolish = data.about_paragraph || '';
    if (!textToPolish.trim()) {
      alert("Please write something in the About Paragraph first before polishing.");
      return;
    }

    setPolishing(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/api/ai/polish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ text: textToPolish, type: "bio" }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        onChange({ target: { name: "about_paragraph", value: result.polishedText } });
      } else {
        alert(result.message || "Failed to polish text.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI service.");
    } finally {
      setPolishing(false);
    }
  };

  return (
    <section className="py-20 border-b border-gray-900">
      
      <div className="flex items-end gap-4 mb-16">
        <span 
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          02
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          About & Profiles
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* About Paragraph */}
        <div className="flex flex-col md:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">About Paragraph</label>
            <button
              type="button"
              onClick={handlePolish}
              disabled={polishing}
              className="text-xs font-bold text-violet-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {polishing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin inline-block" />
                  Polishing...
                </>
              ) : (
                "✨ Polish with AI"
              )}
            </button>
          </div>
          <textarea 
            name="about_paragraph" value={data.about_paragraph ?? ''} onChange={onChange}
            placeholder="Briefly describe your focus, skills, and background..."
            rows="4"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700 resize-none"
          ></textarea>
        </div>

        {/* Education Details */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">College / University Name</label>
          <input 
            type="text" name="college_name" value={data.college_name ?? ''} onChange={onChange}
            placeholder="e.g. Indian Institute of Information Technology, Kota"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Course Name</label>
          <input 
            type="text" name="course_name" value={data.course_name ?? ''} onChange={onChange}
            placeholder="e.g. B.Tech"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Specialization</label>
          <input 
            type="text" name="specialization_course_name" value={data.specialization_course_name ?? ''} onChange={onChange}
            placeholder="e.g. Computer Science"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        {/* Coding Profiles */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">GitHub Username</label>
          <input 
            type="text" name="github_username" value={data.github_username ?? ''} onChange={onChange}
            placeholder="e.g. ishanbagra"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">LeetCode Username</label>
          <input 
            type="text" name="leetcode_username" value={data.leetcode_username ?? ''} onChange={onChange}
            placeholder="e.g. ishanbagra"
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        {/* Resume URL */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Resume URL
            <span className="ml-2 text-gray-700 font-normal normal-case tracking-normal text-xs">
              (paste your hosted resume link — Google Drive, LinkedIn, Dropbox, etc.)
            </span>
          </label>
          <input 
            type="url" name="resume_url" value={data.resume_url ?? ''} onChange={onChange}
            placeholder="https://drive.google.com/file/d/..."
            className="bg-transparent border-b-2 border-gray-800 text-xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
          {data.resume_url && (
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 w-fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open resume in new tab
            </a>
          )}
        </div>

      </div>
    </section>
  );
};

export default AboutForm;