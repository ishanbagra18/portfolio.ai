import { GridBackground, SheetLabel } from './Schematic';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 py-24">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-5xl">
        <SheetLabel index="05" title="Experience / Timeline" />

        <div className="relative border-l border-dashed border-[#7EC8E3]/25 pl-8 space-y-10">
          {data.map((exp, index) => (
            <div key={index} className="relative">
              <span className="absolute -left-[38px] top-1.5 h-3 w-3 border-2 border-[#FF6B35] bg-[#0B1D33]" />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h4 className="font-['IBM_Plex_Mono'] text-lg sm:text-xl font-bold text-[#E8EEF3]">
                  {exp.role}
                </h4>
                <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#8FA3B8]">
                  {exp.date_of_joining}
                </span>
              </div>
              <p className="mt-1 font-['IBM_Plex_Mono'] text-sm text-[#7EC8E3]">
                {exp.company_name}
              </p>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-[#8FA3B8] font-['IBM_Plex_Sans']">
                {exp.work_description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;