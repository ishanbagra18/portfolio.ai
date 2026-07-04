import { Dots, Tag, Card, accents } from './Brutal';

const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 py-24">
      <Dots />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Tag bg="#FFD23F" rotate="rotate-1">
          06 · Certifications
        </Tag>

        <h3 className="mt-6 max-w-2xl font-['Archivo_Black'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#12110F]">
          Verified &amp; stamped
        </h3>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.map((cert, index) => {
            const accent = accents[index % accents.length];
            return (
              <Card
                key={index}
                rotate={index % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                className="flex items-center gap-5 p-6"
                shadow={accent}
              >
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-dashed border-[#12110F]"
                  style={{ backgroundColor: accent }}
                >
                  <span className="font-['Archivo_Black'] text-xl text-[#12110F]">✓</span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-[#12110F]">
                    {cert.certification_name}
                  </h4>
                  <p className="mt-1 font-['Space_Mono'] text-xs uppercase tracking-widest text-[#12110F]/60">
                    {cert.issuing_organization}
                  </p>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-['Space_Grotesk'] text-sm font-bold text-[#12110F] underline decoration-2 underline-offset-4 hover:no-underline"
                    >
                      View credential →
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;