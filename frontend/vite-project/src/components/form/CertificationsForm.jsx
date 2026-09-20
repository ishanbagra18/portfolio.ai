import React from 'react';

const CertificationsForm = ({ data, onChange, onAdd }) => {
  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-end gap-4 mb-16">
        <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-zinc-300 dark:text-zinc-700">
          06
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
          Certifications
        </h3>
      </div>

      <div className="space-y-12">
        {data.map((cert, index) => (
          <div key={index} className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/80 dark:bg-zinc-900/40 shadow-xl relative focus-within:border-pink-500 transition-colors">
            
            <div className="absolute -top-4 left-6 bg-[var(--neo-bg)] px-4 text-sm font-bold text-zinc-500 dark:text-zinc-400 tracking-widest">
              CERTIFICATE {index + 1}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Certification Name</label>
                <input 
                  type="text" name="certification_name" value={cert.certification_name ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Machine Learning and Statistics"
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Issuing Organization</label>
                <input 
                  type="text" name="issuing_organization" value={cert.issuing_organization ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Coursera"
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Credential URL</label>
                <input 
                  type="text" name="credential_url" value={cert.credential_url ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="https://..."
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" onClick={onAdd}
        className="mt-10 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xl shadow-sm cursor-pointer"
      >
        + Add Certification
      </button>
    </section>
  );
};

export default CertificationsForm;