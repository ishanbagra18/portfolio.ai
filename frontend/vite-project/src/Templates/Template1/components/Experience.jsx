
const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_30%),radial-gradient(circle_at_right,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_left,_rgba(236,72,153,0.12),_transparent_26%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="absolute -top-16 left-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/8 p-8 sm:p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="mb-10">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Experience
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Professional journey
            </h3>
          </div>

          <div className="space-y-8">
            {data.map((exp, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-fuchsia-400 via-violet-400 to-cyan-400 opacity-60" />
                <div className="absolute left-[-8px] top-2 h-4 w-4 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />

                <div className="rounded-3xl border border-white/10 bg-white/8 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/12">
                  <h4 className="text-xl sm:text-2xl font-bold text-white">
                    {exp.role}
                  </h4>

                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-fuchsia-300">
                      {exp.company_name}
                    </span>
                    <span className="text-sm text-white/55">
                      {exp.date_of_joining}
                    </span>
                  </div>

                  <p className="mt-4 text-sm sm:text-base leading-7 text-white/70">
                    {exp.work_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;