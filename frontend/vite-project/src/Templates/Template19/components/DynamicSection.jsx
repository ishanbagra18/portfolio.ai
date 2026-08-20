import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-12 border-t border-emerald-900/40 font-mono">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-emerald-400 mb-8">
          &gt; ./load_{title.toLowerCase().replace(/\s+/g, '_')}.sh
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-3">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-4 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  [+] {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item, index) => (
              <div key={index} className="p-6 border border-emerald-500/30 rounded-xl bg-black/80 hover:border-emerald-400/60 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <h3 className="text-lg font-bold text-emerald-300 mb-2">
                  # {item[titleField] || `Node ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-emerald-400">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-200 underline font-bold">
                            &gt; LINK
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/20">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-slate-300 text-xs leading-relaxed mb-3">
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
