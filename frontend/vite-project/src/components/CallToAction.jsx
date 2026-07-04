import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 z-10 relative">
      <div className="max-w-6xl mx-auto bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
        {/* Subtle Background Glow inside card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Ready To Upgrade Your Online Presence?
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mb-8 leading-relaxed">
            Join thousands of developers and designers who trust Portfolio.io to land their dream jobs and client contracts.
          </p>
          <button 
            onClick={() => navigate('/viewtemplates')}
            className="bg-[#5EEAD4] text-black font-bold px-8 py-4 rounded text-xs md:text-sm tracking-widest uppercase hover:bg-[#2DD4BF] transition duration-300 shadow-lg shadow-teal-500/10 cursor-pointer"
          >
            Get Started For Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;