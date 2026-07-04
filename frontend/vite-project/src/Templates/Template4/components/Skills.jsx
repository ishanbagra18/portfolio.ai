import { GridBackground, SheetLabel, CornerFrame } from './Schematic';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 py-24">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SheetLabel index="03" title="Tech Stack / Parts List" />

        <CornerFrame className="bg-[#081526]/60 border border-[#7EC8E3]/10 p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {data.map((tech, index) => (
              <div
                key={index}
                className="group relative border border-[#7EC8E3]/10 p-5 transition-colors duration-300 hover:bg-[#7EC8E3]/[0.06]"
              >
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#8FA3B8]/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 font-['IBM_Plex_Mono'] text-lg font-semibold text-[#E8EEF3] transition-colors group-hover:text-[#7EC8E3]">
                  {tech.name}
                </p>
                {tech.category && (
                  <span className="mt-2 inline-block bg-[#FF6B35]/10 px-2 py-0.5 font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#FF6B35]">
                    {tech.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CornerFrame>
      </div>
    </section>
  );
};

export default Skills;