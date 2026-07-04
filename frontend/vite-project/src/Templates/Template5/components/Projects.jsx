import { Dots, Tag, Card, accents } from './Brutal';

const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  const rotations = ['-rotate-1', 'rotate-1', '-rotate-2'];

  return (
    <section className="relative w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 py-24">
      <Dots />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Tag bg="#3B5BFF" rotate="rotate-1">
          <span className="text-white">04 · Projects</span>
        </Tag>

        <h3 className="mt-6 max-w-2xl font-['Archivo_Black'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#12110F]">
          Things I&apos;ve built
        </h3>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {data.map((project, index) => {
            const accent = accents[index % accents.length];
            const rotate = rotations[index % rotations.length];

            // Handle both array and comma-separated string
            const techStack = Array.isArray(project.project_tech_stack)
              ? project.project_tech_stack
              : typeof project.project_tech_stack === "string"
              ? project.project_tech_stack
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter(Boolean)
              : [];

            return (
              <Card
                key={index}
                rotate={rotate}
                className="p-0 overflow-hidden"
              >
                <div
                  className="h-3 w-full"
                  style={{ backgroundColor: accent }}
                />

                <div className="p-6 sm:p-7">
                  <h4 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#12110F]">
                    {project.project_name}
                  </h4>

                  {project.project_desc && (
                    <p className="mt-3 font-['Inter'] text-sm sm:text-base leading-7 text-[#12110F]/75">
                      {project.project_desc}
                    </p>
                  )}

                  {techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="border-[2px] border-[#12110F] bg-[#F6F1E4] px-2.5 py-1 font-['Space_Mono'] text-[10px] uppercase tracking-widest text-[#12110F]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.project_github_link && (
                    <a
                      href={project.project_github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 border-[3px] border-[#12110F] bg-[#12110F] px-4 py-2 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest text-[#F6F1E4] transition-transform duration-200 hover:-translate-y-1"
                      style={{ boxShadow: `4px 4px 0 ${accent}` }}
                    >
                      View on GitHub →
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

export default Projects;