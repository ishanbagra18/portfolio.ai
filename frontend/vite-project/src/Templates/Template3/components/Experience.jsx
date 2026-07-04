import React from 'react';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-20 text-slate-900 min-h-screen flex items-center">
      {/* Subtle grid background matching previous components */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            05. Experience
          </h3>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Work history and leadership
          </p>
        </div>

        {/* Changed from a standard timeline to a stack of wide, editorial-style split panels */}
        <div className="flex flex-col gap-8">
          {data.map((exp, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200/50"
            >
              {/* Thick interactive accent strip on the left edge */}
              <div className="absolute bottom-0 left-0 top-0 w-3 bg-slate-200 transition-colors duration-500 group-hover:bg-gradient-to-b group-hover:from-indigo-500 group-hover:to-teal-400" />

              <div className="flex flex-col md:flex-row gap-6 md:gap-12 p-8 sm:p-10 ml-3">
                
                {/* Left Column: Date & Company */}
                <div className="flex flex-col justify-start md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
                  <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 transition-colors duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    {exp.date_of_joining}
                  </div>
                  
                  <h4 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {exp.company_name}
                  </h4>
                </div>

                {/* Right Column: Role & Description */}
                <div className="md:w-2/3 flex flex-col justify-center">
                  <h5 className="text-xl sm:text-2xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-indigo-600">
                    {exp.role}
                  </h5>
                  
                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
                    {exp.work_description}
                  </p>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;