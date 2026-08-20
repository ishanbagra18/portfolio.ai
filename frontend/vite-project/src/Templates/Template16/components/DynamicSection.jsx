import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-12 border-t border-fuchsia-500/20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 mb-8">
          // {title}
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-3">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-4 py-2 bg-fuchsia-950/40 border border-fuchsia-500/40 rounded-xl text-sm text-cyan-300 font-mono shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                  ⚡ {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item, index) => (
              <div key={index} className="p-6 border border-fuchsia-500/30 rounded-2xl bg-black/60 backdrop-blur-md hover:border-cyan-400/60 transition-all shadow-[0_0_20px_rgba(217,70,239,0.15)]">
                <h3 className="text-xl font-bold text-fuchsia-300 mb-2">
                  {item[titleField] || `Item ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-cyan-400 font-mono">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-fuchsia-300 underline font-bold">
                            🌐 Link
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-fuchsia-950/50 px-2.5 py-1 rounded-md border border-fuchsia-500/20">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-slate-300 text-sm leading-relaxed mb-3 font-medium">
                      {item[field]}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicSection;
