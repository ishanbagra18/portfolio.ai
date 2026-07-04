
const About = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_30%),radial-gradient(circle_at_right,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_left,_rgba(236,72,153,0.12),_transparent_26%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="absolute -top-16 left-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/8 p-8 sm:p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="mb-10">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              About Me
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              A little more about me
            </h3>
          </div>

          <p className="text-base sm:text-lg leading-8 text-white/75 max-w-4xl">
            {data.about_paragraph}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.18)]">
              <h4 className="mb-3 text-lg font-semibold text-white">Education</h4>
              <p className="text-xl font-medium text-fuchsia-300">{data.college_name}</p>
              <p className="mt-2 text-white/65">{data.course_name}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.18)]">
              <h4 className="mb-3 text-lg font-semibold text-white">Focus</h4>
              <p className="text-white/75 leading-7">
                Building clean, modern, and intuitive interfaces with strong visual polish and thoughtful UX.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
              <h4 className="mb-4 text-xl font-semibold text-white">GitHub Stats</h4>
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.github_username}&theme=github-dark&hide_border=true`}
                alt="GitHub Streak"
                className="w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)]"
              />

              <img
                src={`src="https://github-readme-stats.vercel.app/api?username=${data.github_username}&show_icons=true&theme=github_dark&hide_border=true&border_radius=10"`}
                alt="GitHub Streak"
                className="w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)]"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
              <h4 className="mb-4 text-xl font-semibold text-white">LeetCode Stats</h4>
              <img
                src={`https://leetcard.jacoblin.cool/${data.leetcode_username}?theme=dark&font=Fira+Code&ext=activity`}
                alt="LeetCode Stats"
                className="w-full rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;