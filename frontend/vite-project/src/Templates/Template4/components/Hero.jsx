import { GridBackground, SheetLabel, CornerFrame } from './Schematic';

const Hero = ({ data }) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 flex items-center">
      <GridBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 py-24 lg:grid-cols-12">
        {/* Left: identity block */}
        <div className="lg:col-span-7">
          <SheetLabel index="01" title="Hero / Identity" />

          <span className="block font-['IBM_Plex_Sans'] text-base sm:text-lg text-[#8FA3B8] mb-3">
            // operator profile
          </span>

          <h1 className="font-['IBM_Plex_Mono'] text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-[#E8EEF3]">
            {data.full_name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-16 bg-[#FF6B35]" />
            <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-[0.25em] text-[#FF6B35]">
              Scale 1:1
            </span>
          </div>

          <p className="mt-6 max-w-xl text-base sm:text-lg leading-7 text-[#8FA3B8] font-['IBM_Plex_Sans']">
            {data.main_title}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {data?.resume_url && (
              <a
                href={data.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-[#0B1D33] font-['IBM_Plex_Mono'] uppercase tracking-widest transition-all duration-300 hover:bg-[#E8EEF3]"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                }}
              >
                View Resume
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            )}

            <div className="flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-[0.25em] text-[#8FA3B8]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ECD8B] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ECD8B]" />
              </span>
              Available for work
            </div>
          </div>
        </div>

        {/* Right: rotating technical reticle */}
        <div className="lg:col-span-5 flex justify-center">
          <CornerFrame className="p-10">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#7EC8E3]/20" />
              <div className="absolute inset-6 rounded-full border border-dashed border-[#7EC8E3]/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-14 rounded-full border border-[#FF6B35]/30 animate-[spin_14s_linear_infinite_reverse]" />

              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-2 w-px bg-[#7EC8E3]/40"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 15}deg) translate(0, -128px)`,
                    transformOrigin: 'center',
                  }}
                />
              ))}

              <div
                className="relative flex h-24 w-24 items-center justify-center bg-[#081526] border border-[#7EC8E3]/40"
                style={{
                  clipPath:
                    'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)',
                }}
              >
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-[0.2em] text-[#7EC8E3] text-center leading-4">
                  Dev
                  <br />
                  Node
                </span>
              </div>
            </div>
          </CornerFrame>
        </div>
      </div>
    </section>
  );
};

export default Hero;