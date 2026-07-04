import { PlateLabel, Watermark, Hairline } from './Editorial';

const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 py-28">
      <Watermark text="06" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <PlateLabel number="06" title="Certifications" />

        <div>
          {data.map((cert, index) => (
            <div key={index}>
              <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h4 className="font-['Fraunces'] text-xl sm:text-2xl text-[#1B1B1B]">
                    {cert.certification_name}
                  </h4>
                  <p className="mt-1 font-['Inter'] text-xs uppercase tracking-[0.25em] text-[#B8935F]">
                    {cert.issuing_organization}
                  </p>
                </div>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border-b border-[#1F4D3A]/40 pb-1 font-['Inter'] text-xs uppercase tracking-[0.25em] text-[#1F4D3A] transition-colors hover:border-[#1F4D3A]"
                  >
                    Verify →
                  </a>
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

export default Certifications;