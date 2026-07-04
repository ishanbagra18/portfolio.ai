
import {GridBackground, SheetLabel, CornerFrame } from './Schematic';


const About = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 py-24">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SheetLabel index="02" title="About / Specification" />

        <CornerFrame className="p-8 sm:p-10 lg:p-12 bg-[#081526]/60 border border-[#7EC8E3]/10">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h3 className="font-['IBM_Plex_Mono'] text-2xl sm:text-3xl font-bold text-[#E8EEF3] mb-6">
                Notes &amp; Description
              </h3>
              <p className="text-base leading-8 text-[#8FA3B8] font-['IBM_Plex_Sans']">
                {data.about_paragraph}
              </p>
            </div>

            <div className="lg:col-span-2 space-y-px bg-[#7EC8E3]/10">
              {[
                ['Institution', data.college_name],
                ['Program', data.course_name],
                ['GitHub', `@${data.github_username}`],
                ['LeetCode', `@${data.leetcode_username}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-[#0B1D33] px-5 py-4"
                >
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#8FA3B8]">
                    {label}
                  </span>
                  <span className="font-['IBM_Plex_Mono'] text-sm text-[#7EC8E3] text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="border border-[#7EC8E3]/15 p-5">
              <p className="mb-4 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.25em] text-[#FF6B35]">
                Readout — GitHub
              </p>
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.github_username}&theme=dark&hide_border=true&background=081526&stroke=7EC8E3&ring=FF6B35&fire=FF6B35&currStreakLabel=7EC8E3`}
                alt="GitHub Streak"
                className="w-full"
              />
            </div>
            <div className="border border-[#7EC8E3]/15 p-5">
              <p className="mb-4 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.25em] text-[#FF6B35]">
                Readout — LeetCode
              </p>
              <img
                src={`https://leetcard.jacoblin.cool/${data.leetcode_username}?theme=dark&font=IBM+Plex+Mono&ext=activity`}
                alt="LeetCode Stats"
                className="w-full"
              />
            </div>
          </div>
        </CornerFrame>
      </div>
    </section>
  );
};

export default About;