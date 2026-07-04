import { PlateLabel, Watermark, Hairline } from './Editorial';

const About = ({ data }) => {
  const firstLetter = data.about_paragraph?.charAt(0) || '';
  const rest = data.about_paragraph?.slice(1) || '';

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 py-28">
      <Watermark text="02" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <PlateLabel number="02" title="About the Author" />

        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-['Inter'] text-base sm:text-lg leading-8 text-[#3a3a36]">
              <span className="float-left mr-3 font-['Fraunces'] text-6xl sm:text-7xl leading-[0.8] text-[#1F4D3A]">
                {firstLetter}
              </span>
              {rest}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-0">
              {[
                ['Institution', data.college_name],
                ['Program', data.course_name],
                ['GitHub', `@${data.github_username}`],
                ['LeetCode', `@${data.leetcode_username}`],
              ].map(([label, value], i, arr) => (
                <div key={label}>
                  <div className="flex items-baseline justify-between gap-4 py-4">
                    <span className="font-['Inter'] text-[11px] uppercase tracking-[0.25em] text-[#6B6B63]">
                      {label}
                    </span>
                    <span className="font-['Fraunces'] text-right text-lg text-[#1B1B1B]">
                      {value}
                    </span>
                  </div>
                  {i < arr.length - 1 && <Hairline />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <figure>
            <img
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.github_username}&theme=dark&hide_border=true`}
              alt="GitHub Streak"
              className="w-full border border-[#1B1B1B]/10"
            />
            <figcaption className="mt-3 font-['Inter'] text-[11px] uppercase tracking-[0.25em] text-[#6B6B63]">
              Fig. i — GitHub activity
            </figcaption>
          </figure>

          <figure>
            <img
              src={`https://leetcard.jacoblin.cool/${data.leetcode_username}?theme=dark&font=Inter&ext=activity`}
              alt="LeetCode Stats"
              className="w-full border border-[#1B1B1B]/10"
            />
            <figcaption className="mt-3 font-['Inter'] text-[11px] uppercase tracking-[0.25em] text-[#6B6B63]">
              Fig. ii — LeetCode record
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;