import { Dots, Tag, accents } from './Brutal';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  const rotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'];

  return (
    <section className="relative w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 py-24">
      <Dots />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Tag bg="#FF4D9D" rotate="-rotate-1">
          03 · Tech Stack
        </Tag>

        <h3 className="mt-6 max-w-2xl font-['Archivo_Black'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#12110F]">
          Tools I reach for
        </h3>

        <div className="mt-12 flex flex-wrap gap-5">
          {data.map((tech, index) => {
            const bg = accents[index % accents.length];
            const rotate = rotations[index % rotations.length];
            return (
              <div
                key={index}
                className={`${rotate} border-[3px] border-[#12110F] px-6 py-4 transition-transform duration-200 hover:rotate-0 hover:-translate-y-1`}
                style={{ backgroundColor: bg, boxShadow: '6px 6px 0 #12110F' }}
              >
                <p className="font-['Space_Grotesk'] text-lg font-bold text-[#12110F]">
                  {tech.name}
                </p>
                {tech.category && (
                  <p className="mt-1 font-['Space_Mono'] text-[10px] uppercase tracking-widest text-[#12110F]/70">
                    {tech.category}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;