import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Import Profile Data',
      description: 'Fill in your personal bio, work experience, tech stack, and social links manually or import them directly using your account profile.'
    },
    {
      number: '02',
      title: 'Select a Template',
      description: 'Browse our curated collection of sleek, modern themes. Toggle minimalist aesthetics, dark modes, and layout grids with a single click.'
    },
    {
      number: '03',
      title: 'Publish & Share',
      description: 'Hit deploy to launch your personalized portfolio live to the world. Share your sleek URL with recruiters, clients, and peers.'
    }
  ];

  return (
    <section className="py-24 border-t border-zinc-900 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="text-xs font-bold text-[#5EEAD4] uppercase tracking-widest block mb-2">Process</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Live In 3 Simple Steps
            </h2>
          </div>
          <p className="text-zinc-500 text-sm mt-4 md:mt-0 max-w-xs">
            No design degrees or server setup required. Get from zero to deployed in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-6 border-l-2 border-zinc-800 hover:border-[#5EEAD4] transition duration-300 py-2">
              <span className="text-5xl font-black text-zinc-800 tracking-tighter block mb-4">
                {step.number}
              </span>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">
                {step.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;