import React from 'react';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-20 text-slate-900 min-h-screen flex items-center">
      {/* Subtle grid background matching the previous components */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            03. Tech Stack
          </h3>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Languages, frameworks, and tools
          </p>
        </div>

        {/* Updated grid to accommodate the new square shape (more columns) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-6 lg:gap-8">
          {data.map((tech, index) => (
            <div
              key={index}
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-200/50"
            >
              {/* Top soft gradient overlay on hover */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-50/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Abstract animated node icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-transform duration-300 group-hover:scale-110 group-hover:bg-indigo-50">
                  <div className="h-4 w-4 rounded-full bg-slate-300 transition-colors duration-300 group-hover:bg-indigo-500 shadow-inner" />
                </div>
                
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                  {tech.name}
                </p>
                
                {tech.category && (
                  <p className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {tech.category}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;