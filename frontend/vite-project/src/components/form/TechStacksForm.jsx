import React from 'react';

const TechStacksForm = ({ data, onChange, onAdd }) => {
  return (
    <section className="py-20 border-b border-gray-900">
      <div className="flex items-end gap-4 mb-16">
        <span 
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          03
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Tech Stack
        </h3>
      </div>

      <div className="space-y-8">
        {data.map((tech, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-6 items-end p-6 border border-gray-800 rounded-lg focus-within:border-white transition-colors group">
            
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 block">Skill Name</label>
              <input 
                type="text" name="name" value={tech.name ?? ''} onChange={(e) => onChange(index, e)}
                placeholder="e.g. React"
                className="w-full bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2 block">Category</label>
              <input 
                type="text" name="category" value={tech.category ?? ''} onChange={(e) => onChange(index, e)}
                placeholder="e.g. Frontend"
                className="w-full bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" onClick={onAdd}
        className="mt-10 px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all"
      >
        + Add Skill
      </button>
    </section>
  );
};

export default TechStacksForm;