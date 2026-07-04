
const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_30%),radial-gradient(circle_at_right,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_left,_rgba(236,72,153,0.12),_transparent_26%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="absolute -top-16 left-[-5rem] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-cyan-500/15 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/8 p-8 sm:p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="mb-10">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
              Certifications
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Verified learning and achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.map((cert, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/12"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.10),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <h4 className="text-xl sm:text-2xl font-bold text-white transition group-hover:text-fuchsia-300">
                    {cert.certification_name}
                  </h4>

                  <p className="mt-2 text-sm font-medium text-cyan-300">
                    {cert.issuing_organization}
                  </p>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
                    >
                      View Credential
                      <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;