// import React from 'react';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] px-4 sm:px-6 lg:px-8 py-20 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_right,_rgba(168,85,247,0.10),_transparent_24%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),_transparent_22%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] text-white">
            02. Tech Stack
          </h3>
          <p className="hidden sm:block text-sm text-white/35">
            Tools and technologies I use regularly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((tech, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.10),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {tech.name}
                  </p>
                  {tech.category && (
                    <p className="mt-1 text-sm text-white/45">
                      {tech.category}
                    </p>
                  )}
                </div>

                <div className="h-3 w-3 rounded-full bg-white/25 group-hover:bg-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;