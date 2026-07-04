import { PlateLabel, Watermark, Hairline, getInitials } from './Editorial';

const Hero = ({ data }) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 flex items-center">
      <Watermark text="01" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 py-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PlateLabel number="01" title="Curriculum Vitae" />

          <h1 className="font-['Fraunces'] text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02] text-[#1B1B1B]">
            {data.full_name}
          </h1>

          <Hairline className="mt-8 max-w-md" />

          <p className="mt-8 max-w-lg font-['Inter'] text-base sm:text-lg leading-8 text-[#6B6B63]">
            {data.main_title}
          </p>

          {data?.resume_url && (
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 border-b border-[#1F4D3A]/40 pb-1 font-['Inter'] text-sm uppercase tracking-[0.25em] text-[#1F4D3A] transition-colors hover:border-[#1F4D3A]"
            >
              View Résumé
              <span>—</span>
            </a>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col items-center justify-center gap-6 lg:items-end">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#1B1B1B]/15">
            <span className="font-['Fraunces'] text-3xl italic text-[#1F4D3A]">
              {getInitials(data.full_name)}
            </span>
          </div>
          <p className="font-['Inter'] text-[11px] uppercase tracking-[0.3em] text-[#6B6B63] text-center lg:text-right">
            Available for
            <br className="hidden lg:block" /> opportunities
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;