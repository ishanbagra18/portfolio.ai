import { PlateLabel, Watermark, Hairline } from './Editorial';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 py-28">
      <Watermark text="05" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <PlateLabel number="05" title="Professional Record" />

        <div>
          {data.map((exp, index) => (
            <div key={index}>
              <div className="grid gap-4 py-10 sm:grid-cols-12 sm:gap-8">
                <div className="sm:col-span-3">
                  <span className="font-['Inter'] text-xs uppercase tracking-[0.25em] text-[#B8935F]">
                    {exp.date_of_joining}
                  </span>
                </div>
                <div className="sm:col-span-9">
                  <h4 className="font-['Fraunces'] text-2xl text-[#1B1B1B]">{exp.role}</h4>
                  <p className="mt-1 font-['Inter'] text-sm uppercase tracking-[0.2em] text-[#6B6B63]">
                    {exp.company_name}
                  </p>
                  <p className="mt-4 max-w-2xl font-['Inter'] text-sm sm:text-base leading-7 text-[#3a3a36]">
                    {exp.work_description}
                  </p>
                </div>
              </div>
              <Hairline />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;