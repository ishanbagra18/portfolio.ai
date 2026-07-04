const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] px-4 sm:px-6 lg:px-8 py-20 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_right,_rgba(168,85,247,0.10),_transparent_24%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),_transparent_22%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] text-white">
            03. Projects
          </h3>

          <p className="hidden sm:block text-sm text-white/35">
            Selected work, experiments, and builds
          </p>
        </div>

        <div className="space-y-8">
          {data.map((project, index) => {
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
              <div
                key={index}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/35">
                        Project {index + 1}
                      </span>

                      <span className="h-px w-16 bg-white/15" />
                    </div>

                    <h4 className="mt-4 text-2xl sm:text-3xl font-bold text-white transition group-hover:text-white/90">
                      {project.project_name}
                    </h4>

                    {project.project_desc && (
                      <p className="mt-4 max-w-3xl text-base sm:text-lg leading-8 text-white/70">
                        {project.project_desc}
                      </p>
                    )}

                    {techStack.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {project.project_github_link && (
                    <a
                      href={project.project_github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90"
                    >
                      View Repository
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;