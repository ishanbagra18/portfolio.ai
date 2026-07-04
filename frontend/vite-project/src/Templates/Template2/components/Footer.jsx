// import React from 'react';

const Footer = ({ data }) => {
  return (
    <footer className="w-full bg-black border-t border-gray-900 flex flex-col items-center justify-center py-24 md:py-32 px-6 font-sans">
      
      {/* Massive Thank You Section */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-6xl sm:text-8xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-none">
          Thank You
        </h2>
        <h2
          className="text-5xl sm:text-7xl md:text-[7rem] font-black uppercase tracking-tighter leading-none mt-2"
          style={{ WebkitTextStroke: '2px #374151', color: 'transparent' }}
        >
          For Visiting.
        </h2>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-8 pt-8 border-t border-gray-800 text-gray-500 font-mono text-xs md:text-sm uppercase tracking-widest">
        <span className="mb-4 md:mb-0">
          © {new Date().getFullYear()} {data.full_name}
        </span>
        <span>All rights reserved.</span>
      </div>
      
    </footer>
  );
};

export default Footer;