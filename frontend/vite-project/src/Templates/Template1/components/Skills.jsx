
const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    // ADDED: min-h-screen, flex, items-center, justify-center, and snap-center
    <section className="relative min-h-screen w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 flex flex-col justify-center snap-center py-12">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_30%),radial-gradient(circle_at_right,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_left,_rgba(236,72,153,0.12),_transparent_26%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Glowing Orbs */}
      <div className="absolute -top-16 left-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.5),_inset_0_0_40px_rgba(255,255,255,0.05)] backdrop-blur-3xl">
          
          <div className="mb-12 text-center sm:text-left">
            <p className="mb-4 inline-flex rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-200 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              Tech Stack
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              Tools and technologies I use
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((tech, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-500/40 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]"
              >
                {/* Sweeping Glass Shine Effect */}
                <div className="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100" />
                
                {/* Inner Hover Gradient Glow */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex items-center gap-4">
                  {/* Skill Icon Box - Intense Frosted Glass */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:border-fuchsia-400/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <span className="text-xl font-black bg-gradient-to-br from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                      {tech.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>

                  {/* Skill Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-fuchsia-100">
                      {tech.name}
                    </p>
                    <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-white/50 to-white/30 transition-all duration-300 group-hover:from-fuchsia-300/80 group-hover:to-cyan-300/80">
                      Proficient
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Skills;