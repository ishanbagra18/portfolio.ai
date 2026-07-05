import { GridBackground, SheetLabel, CornerFrame } from './Schematic';

const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#0B1D33] px-4 sm:px-6 lg:px-10 py-24">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SheetLabel index="04" title="Projects / Build Log" />

        <div className="space-y-6">
          {data.map((project, index) => {
            // Supports both array and comma-separated string
            const techStack = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === "string"
              ? project.project_tech_stack
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : [];

            return (
              <CornerFrame
                key={index}
                className="bg-[#081526]/60 border border-[#7EC8E3]/10 p-6 sm:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-1">
                    <span className="font-['IBM_Plex_Mono'] text-3xl font-bold text-[#7EC8E3]/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="lg:col-span-8">
                    <h4 className="font-['IBM_Plex_Mono'] text-xl sm:text-2xl font-bold text-[#E8EEF3]">
                      {project.project_name}
                    </h4>

                    {project.project_desc && (
                      <p className="mt-3 text-sm sm:text-base leading-7 text-[#8FA3B8] font-['IBM_Plex_Sans']">
                        {project.project_desc}
                      </p>
                    )}

                    {project.project_image && (
                      <div className="mt-4 overflow-hidden rounded border border-[#7EC8E3]/10 bg-[#081526] max-w-md flex justify-center items-center shadow-inner">
                        {project.project_image.match(/\.(mp4|webm|ogg)$/i) || project.project_image.includes('video-') ? (
                          <video src={project.project_image} controls className="w-full h-auto object-cover max-h-48" />
                        ) : (
                          <img src={project.project_image} alt={project.project_name} className="w-full h-auto object-cover max-h-48 opacity-90 transition-opacity duration-300 hover:opacity-100" />
                        )}
                      </div>
                    )}

                    {techStack.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="border border-[#7EC8E3]/20 px-2.5 py-1 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#7EC8E3]/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-3 flex lg:justify-end">
                    {project.project_github_link && (
                      <a
                        href={project.project_github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 border border-[#FF6B35]/40 px-4 py-2 font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#FF6B35] transition-colors hover:bg-[#FF6B35] hover:text-[#0B1D33]"
                      >
                        Repository
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </CornerFrame>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;