import React from 'react';

const TechStacksForm = ({ data, onChange, onAdd }) => {
  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-end gap-4 mb-16">
        <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-zinc-300 dark:text-zinc-700">
          04
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
          Tech Stack
        </h3>
      </div>

      <div className="space-y-8">
        {data.map((tech, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-6 items-end p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/80 dark:bg-zinc-900/40 shadow-md focus-within:border-pink-500 transition-colors group">
            
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 block">Skill Name</label>
              <input 
                type="text" name="name" value={tech.name ?? ''} onChange={(e) => onChange(index, e)}
                placeholder="e.g. React"
                className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 block">Category</label>
              <input 
                type="text" name="category" value={tech.category ?? ''} onChange={(e) => onChange(index, e)}
                placeholder="e.g. Frontend"
                className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" onClick={onAdd}
        className="mt-10 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xl shadow-sm cursor-pointer"
      >
        + Add Skill
      </button>
    </section>
  );
};

export default TechStacksForm;