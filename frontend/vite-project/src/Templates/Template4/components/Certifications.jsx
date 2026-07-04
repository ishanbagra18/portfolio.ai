import { GridBackground, SheetLabel, CornerFrame } from './Schematic';

const Certifications = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 py-24">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SheetLabel index="06" title="Certifications / Verified" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.map((cert, index) => (
            <CornerFrame
              key={index}
              className="bg-[#081526]/60 border border-[#7EC8E3]/10 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-['IBM_Plex_Mono'] text-lg sm:text-xl font-bold text-[#E8EEF3]">
                    {cert.certification_name}
                  </h4>
                  <p className="mt-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#FF6B35]">
                    {cert.issuing_organization}
                  </p>
                </div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#8FA3B8]/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#7EC8E3] transition-colors hover:text-[#E8EEF3]"
                >
                  Verify Credential
                  <span>↗</span>
                </a>
              )}
            </CornerFrame>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;