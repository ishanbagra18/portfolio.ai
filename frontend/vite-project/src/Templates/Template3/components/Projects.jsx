import React from 'react';

const Projects = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden bg-slate-50 px-4 sm:px-6 lg:px-8 py-20 text-slate-900 min-h-screen flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            04. Projects
          </h3>

          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Selected work and builds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
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
              <div
                key={index}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50 hover:border-indigo-200"
              >
                {/* Header */}
                <div className="relative h-32 w-full bg-gradient-to-br from-indigo-100 via-white to-teal-50 border-b border-slate-100">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:12px_12px]" />

                  <div className="absolute left-6 top-6">
                    <span className="inline-block rounded-full bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 shadow-sm border border-slate-100">
                      Project {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6 sm:p-8">
                  <h4 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {project.project_name}
                  </h4>

                  {project.project_desc && (
                    <p className="mt-4 text-base leading-relaxed text-slate-600 flex-grow">
                      {project.project_desc}
                    </p>
                  )}

                  {techStack.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                      {techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.project_github_link && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                      <a
                        href={project.project_github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300"
                      >
                        View Repository
                      </a>
                    </div>
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