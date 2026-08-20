import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-12 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-200 mb-8 font-mono">
          [ {title} ]
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-3">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-4 py-2 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-300 font-medium tracking-wide">
                  {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item, index) => (
              <div key={index} className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-md hover:border-slate-700 transition-all">
                <h3 className="text-lg font-bold text-white mb-2">
                  {item[titleField] || `Item ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-400 font-mono">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-bold">
                            Link
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-slate-400 text-sm leading-relaxed mb-3">
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
