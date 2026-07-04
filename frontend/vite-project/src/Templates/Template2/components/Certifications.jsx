// import React from 'react';

const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="min-h-screen w-full bg-black flex flex-col justify-center border-t border-gray-900 font-sans">
      <div className="max-w-6xl mx-auto w-full px-6 py-24">
        
        {/* Massive Bold Heading */}
        <div className="flex items-end gap-4 mb-20 md:mb-24">
          <span 
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            style={{ WebkitTextStroke: '2px #374151', color: 'transparent' }}
          >
            05
          </span>
          <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Certifications
          </h3>
        </div>

        {/* Minimalist Dark Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {data.map((cert, index) => (
            <div 
              key={index} 
              className="group flex flex-col p-8 md:p-10 border border-gray-800 hover:border-white transition-colors duration-500"
            >
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                {cert.certification_name}
              </h4>
              <p className="text-lg text-gray-500 font-mono tracking-widest uppercase mb-10">
                {cert.issuing_organization}
              </p>
              
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto text-lg font-bold text-gray-400 hover:text-white flex items-center transition-colors w-max"
                >
                  <span className="mr-2">View Credential</span>
                  <span className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300">↗</span>
                </a>
              )}
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Certifications;