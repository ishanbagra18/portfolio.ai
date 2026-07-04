import React from 'react';

const About = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-20 text-slate-900">
      {/* Subtle grid background matching the Hero component */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            02. About
          </h3>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Background, education, and stats
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-600">
              {data?.about_paragraph}
            </p>

            <div className="mt-12 relative rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
              {/* Subtle top gradient bar to tie into the Hero's accent colors */}
              <div className="absolute top-0 left-8 right-8 h-1 rounded-b-md bg-gradient-to-r from-indigo-500 to-teal-400 opacity-70" />
              
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-4 mt-2">
                Education
              </span>
              <p className="text-2xl font-bold text-slate-900">{data?.college_name}</p>
              <p className="mt-2 text-base font-medium text-slate-500">{data?.course_name}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                GitHub Activity
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-200/50 transition-transform hover:-translate-y-1 duration-300">
                {/* Updated API params to remove dark mode and use default light styling */}
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${data?.github_username}&theme=default&hide_border=true`}
                  alt="GitHub Stats"
                  className="w-full rounded-xl"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                LeetCode Progress
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-200/50 transition-transform hover:-translate-y-1 duration-300">
                 {/* Updated to theme=light */}
                <img
                  src={`https://leetcard.jacoblin.cool/${data?.leetcode_username}?theme=light&font=Inter&ext=activity`}
                  alt="LeetCode Stats"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;