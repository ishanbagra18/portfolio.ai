import React from 'react';

const Footer = ({ data }) => {
  return (
    <footer className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 flex items-center justify-center">
      {/* Subtle grid background matching previous components */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-xl shadow-slate-200/50">
          
          {/* Decorative top gradient bar to match the Hero's accent colors */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-teal-400 to-indigo-500" />

          {/* Replaced the plain text with a styled pill badge */}
          <p className="inline-block rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
            06. End of Portfolio
          </p>

          {/* Gradient text to bookend the site with the Hero section */}
          <h3 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 pb-2">
            Thank You
          </h3>

          <p className="mt-4 text-base sm:text-lg font-medium text-slate-600">
            Thanks for checking out my work.
          </p>

          {/* Copyright Section with a subtle divider */}
          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="h-px w-16 bg-slate-200 mb-6" />
            <p className="text-sm font-semibold text-slate-400">
              © {new Date().getFullYear()} {data?.full_name}. All rights reserved.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;