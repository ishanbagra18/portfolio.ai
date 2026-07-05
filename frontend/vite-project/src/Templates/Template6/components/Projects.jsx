import { PlateLabel, Watermark, Hairline } from './Editorial';

const toRoman = (num) => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romans[num - 1] || String(num);
};

const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#F7F4EE] px-6 sm:px-10 lg:px-16 py-28">
      <Watermark text="04" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <PlateLabel number="04" title="Selected Works" />

        <div>
          {data.map((project, index) => {
            const techStack = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === "string"
              ? project.project_tech_stack
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : [];

            return (
              <div key={index}>
                <div className="grid gap-6 py-12 lg:grid-cols-12">
                  <div className="lg:col-span-2">
                    <span className="font-['Fraunces'] italic text-3xl text-[#B8935F]">
                      {toRoman(index + 1)}
                    </span>
                  </div>

                  <div className="lg:col-span-7">
                    <h4 className="font-['Fraunces'] text-2xl sm:text-3xl text-[#1B1B1B]">
                      {project.project_name}
                    </h4>

                    {project.project_desc && (
                      <p className="mt-4 max-w-xl font-['Inter'] text-sm sm:text-base leading-7 text-[#6B6B63]">
                        {project.project_desc}
                      </p>
                    )}

                    {project.project_image && (
                      <div className="mt-4 overflow-hidden rounded bg-[#eae6dc] max-w-md flex justify-center items-center shadow-inner">
                        {project.project_image.match(/\.(mp4|webm|ogg)$/i) || project.project_image.includes('video-') ? (
                          <video src={project.project_image} controls className="w-full h-auto object-cover max-h-48" />
                        ) : (
                          <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover max-h-48 filter grayscale hover:grayscale-0 transition-all duration-300" />
                        )}
                      </div>
                    )}

                    {techStack.length > 0 && (
                      <p className="mt-4 font-['Inter'] text-[11px] uppercase tracking-[0.2em] text-[#1B1B1B]/60">
                        {techStack.join("  ·  ")}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-3 flex lg:justify-end">
                    {project.project_github_link && (
                      <a
                        href={project.project_github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border-b border-[#1F4D3A]/40 pb-1 font-['Inter'] text-xs uppercase tracking-[0.25em] text-[#1F4D3A] transition-colors hover:border-[#1F4D3A]"
                      >
                        View Repository →
                      </a>
                    )}
                  </div>
                </div>

                <Hairline />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;