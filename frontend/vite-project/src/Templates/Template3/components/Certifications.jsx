import React from 'react';

const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-20 text-slate-900 min-h-screen flex items-center">
      {/* Subtle grid background matching previous components */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            06. Certifications
          </h3>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Verified learning and achievements
          </p>
        </div>

        {/* Changed to a dense 2-column grid for the new horizontal tags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {data.map((cert, index) => (
            <div
              key={index}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-[2rem] sm:rounded-full border border-slate-200 bg-white p-3 sm:p-4 sm:pr-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Decorative Badge Icon */}
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                  <svg 
                    className="h-6 w-6 text-slate-400 transition-colors duration-300 group-hover:text-indigo-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                {/* Text Content */}
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cert.certification_name}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {cert.issuing_organization}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 sm:mt-0 ml-16 sm:ml-4 inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                >
                  View <span className="hidden sm:inline">Credential</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 sm:ml-1">↗</span>
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