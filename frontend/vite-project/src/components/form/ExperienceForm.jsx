import React, { useState } from 'react';

const ExperienceForm = ({ data, onChange, onAdd }) => {
  const [polishingIndex, setPolishingIndex] = useState(null);

  const handlePolishExperience = async (index, currentText) => {
    if (!currentText || !currentText.trim()) {
      alert("Please write something in the work description first before polishing.");
      return;
    }

    setPolishingIndex(index);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:5000/api/ai/polish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ text: currentText, type: "experience" }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        onChange(index, { target: { name: "work_description", value: result.polishedText } });
      } else {
        alert(result.message || "Failed to polish work description.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to AI service.");
    } finally {
      setPolishingIndex(null);
    }
  };

  return (
    <section className="py-20 border-b border-gray-900">
      <div className="flex items-end gap-4 mb-16">
        <span 
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          04
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Experience
        </h3>
      </div>

      <div className="space-y-16">
        {data.map((exp, index) => (
          <div key={index} className="p-8 border border-gray-800 rounded-lg relative focus-within:border-white transition-colors">
            
            <div className="absolute -top-4 left-6 bg-black px-4 text-sm font-bold text-gray-500 tracking-widest">
              ROLE {index + 1}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Role / Position</label>
                <input 
                  type="text" name="role" value={exp.role ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Team Lead - SIH 2025"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Company / Organization</label>
                <input 
                  type="text" name="company_name" value={exp.company_name ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Team ZeroGrid"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Date (e.g. 2025-12-01)</label>
                <input 
                  type="text" name="date_of_joining" value={exp.date_of_joining ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="YYYY-MM-DD or Month Year"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Work Description
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePolishExperience(index, exp.work_description)}
                    disabled={polishingIndex !== null}
                    className="text-[10px] font-bold text-violet-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {polishingIndex === index ? (
                      <>
                        <span className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin inline-block" /> Polishing...
                      </>
                    ) : (
                      "✨ Polish with AI"
                    )}
                  </button>
                </div>
                <textarea 
                  name="work_description" value={exp.work_description ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows="3"
                  className="bg-transparent border-b border-gray-800 text-lg text-white py-2 focus:outline-none focus:border-white transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" onClick={onAdd}
        className="mt-10 px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all"
      >
        + Add Experience
      </button>
    </section>
  );
};

export default ExperienceForm;