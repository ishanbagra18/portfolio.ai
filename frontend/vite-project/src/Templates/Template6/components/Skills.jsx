import { PlateLabel, Watermark, Hairline } from './Editorial';

const Skills = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 py-28">
      <Watermark text="03" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <PlateLabel number="03" title="Tools of the Trade" />

        <div className="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
          {data.map((tech, index) => (
            <div key={index}>
              <div className="flex items-baseline justify-between gap-4 py-5">
                <span className="flex items-baseline gap-4">
                  <span className="font-['Fraunces'] italic text-sm text-[#B8935F]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-['Fraunces'] text-xl sm:text-2xl text-[#1B1B1B]">
                    {tech.name}
                  </span>
                </span>
                {tech.category && (
                  <span className="font-['Inter'] text-[11px] uppercase tracking-[0.25em] text-[#6B6B63]">
                    {tech.category}
                  </span>
                )}
              </div>
              <Hairline />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;