import { Dots, Tag } from './Brutal';

const Hero = ({ data }) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 flex items-center py-20">
      <Dots />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-12">
        {/* Left: identity */}
        <div className="lg:col-span-7">
          <Tag bg="#FFD23F">Portfolio · v5.0</Tag>

          <h1 className="mt-6 font-['Archivo_Black'] text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#12110F]">
            {data.full_name}
          </h1>

          <div
            className="mt-6 inline-block -rotate-1 border-[3px] border-[#12110F] bg-[#3B5BFF] px-5 py-3"
            style={{ boxShadow: '6px 6px 0 #12110F' }}
          >
            <p className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-white">
              {data.main_title}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {data?.resume_url && (
              <a
                href={data.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-[3px] border-[#12110F] bg-[#12110F] px-7 py-3.5 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wide text-[#F6F1E4] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1 block w-fit"
                style={{ boxShadow: '6px 6px 0 #FF4D9D' }}
              >
                View Resume
              </a>
            )}

            <Tag bg="#B6F24B" rotate="rotate-2">
              ● Open to work
            </Tag>
          </div>
        </div>

        {/* Right: wax-seal style stamp */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="relative flex h-64 w-64 sm:h-72 sm:w-72 rotate-3 items-center justify-center rounded-full border-[3px] border-dashed border-[#12110F] bg-[#FF4D9D]"
            style={{ boxShadow: '10px 10px 0 #12110F' }}
          >
            <div className="flex h-48 w-48 sm:h-52 sm:w-52 -rotate-6 items-center justify-center rounded-full border-[3px] border-[#12110F] bg-[#F6F1E4] text-center">
              <p className="font-['Archivo_Black'] text-lg leading-tight text-[#12110F]">
                HIRE
                <br />
                ME
                <br />
                <span className="text-sm font-['Space_Mono'] font-normal">★ ★ ★</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;