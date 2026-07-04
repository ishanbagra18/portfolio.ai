// import React from 'react';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    // 'min-h-screen' aur 'flex justify-center' isko full page banayenge
    <section className="min-h-screen w-full bg-black flex flex-col justify-center border-t border-gray-900 font-sans">
      <div className="max-w-6xl mx-auto w-full px-6 py-24">
        
        {/* Massive Bold Heading */}
        <div className="flex items-end gap-4 mb-20 md:mb-24">
          <span 
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            style={{ WebkitTextStroke: '2px #374151', color: 'transparent' }}
          >
            04
          </span>
          <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Experience
          </h3>
        </div>

        <div className="space-y-20">
          {data.map((exp, index) => (
            <div 
              key={index} 
              className="group relative pl-8 md:pl-12 border-l-2 border-gray-800 hover:border-white transition-colors duration-500"
            >
              {/* Glowing Dot Indicator */}
              <div className="absolute -left-[9px] top-3 w-4 h-4 bg-gray-800 rounded-full group-hover:bg-white transition-colors duration-500 shadow-[0_0_10px_rgba(255,255,255,0)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6">
                <h4 className="text-4xl md:text-5xl font-bold text-white group-hover:translate-x-3 transition-transform duration-300">
                  {exp.role}
                </h4>
                <span className="text-gray-500 font-mono text-sm md:text-base mt-4 md:mt-0 uppercase tracking-widest">
                  {exp.date_of_joining}
                </span>
              </div>
              
              <p className="text-2xl text-gray-300 font-medium mb-6 uppercase tracking-wide">
                {exp.company_name}
              </p>
              
              <p className="text-xl text-gray-400 font-light leading-relaxed max-w-4xl group-hover:text-gray-200 transition-colors duration-300">
                {exp.work_description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;