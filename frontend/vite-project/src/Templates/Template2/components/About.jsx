// import React from 'react';

const About = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] px-4 sm:px-6 lg:px-8 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_right,_rgba(168,85,247,0.10),_transparent_24%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),_transparent_22%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] text-white">
            01. About
          </h3>
          <p className="hidden sm:block text-sm text-white/35">
            A short introduction and background
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="max-w-3xl text-lg sm:text-xl leading-9 text-white/70">
              {data.about_paragraph}
            </p>

            <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="text-xs font-bold uppercase tracking-[0.35em] text-white/40 mb-3">
                Education
              </h4>
              <p className="text-2xl font-semibold text-white">
                {data.college_name}
              </p>
              <p className="mt-2 text-base text-white/65">
                {data.course_name}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-white/40">
                GitHub
              </p>
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-md">
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.github_username}&theme=dark&hide_border=true&background=050505&stroke=ffffff&ring=ffffff&fire=ffffff`}
                  alt="GitHub Stats"
                  className="w-full rounded-[1rem]"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-white/40">
                LeetCode
              </p>
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-2 backdrop-blur-md">
                <img
                  src={`https://leetcard.jacoblin.cool/${data.leetcode_username}?theme=dark&font=Inter&ext=activity`}
                  alt="LeetCode Stats"
                  className="w-full rounded-[1rem]"
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