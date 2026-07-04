import { Dots, Tag, Card, accents } from './Brutal';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 py-24">
      <Dots />

      <div className="relative z-10 mx-auto max-w-4xl">
        <Tag bg="#B6F24B" rotate="-rotate-1">
          05 · Experience
        </Tag>

        <h3 className="mt-6 max-w-2xl font-['Archivo_Black'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#12110F]">
          Where I&apos;ve worked
        </h3>

        <div className="mt-12 space-y-8">
          {data.map((exp, index) => {
            const accent = accents[index % accents.length];
            return (
              <Card
                key={index}
                rotate={index % 2 === 0 ? '-rotate-1' : 'rotate-1'}
                className="p-6 sm:p-8"
                shadow={accent}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <h4 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#12110F]">
                    {exp.role}
                  </h4>
                  <span className="font-['Space_Mono'] text-xs uppercase tracking-widest text-[#12110F]/60">
                    {exp.date_of_joining}
                  </span>
                </div>

                <span
                  className="mt-2 inline-block border-[2px] border-[#12110F] px-2 py-0.5 font-['Space_Mono'] text-xs uppercase tracking-widest text-[#12110F]"
                  style={{ backgroundColor: accent }}
                >
                  {exp.company_name}
                </span>

                <p className="mt-4 font-['Inter'] text-sm sm:text-base leading-7 text-[#12110F]/75">
                  {exp.work_description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;