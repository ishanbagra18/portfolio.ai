import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-12 border-t border-[#D4AF37]/20 font-serif">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-8">
          {title}
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-3">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-4 py-2 bg-[#121218] border border-[#D4AF37]/30 rounded-full text-xs text-[#F3E5AB] tracking-wide font-sans shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  ✦ {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item, index) => (
              <div key={index} className="p-6 border border-[#D4AF37]/30 rounded-2xl bg-[#121218]/90 backdrop-blur-md hover:border-[#D4AF37]/60 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <h3 className="text-lg font-serif font-bold text-[#F3E5AB] mb-2">
                  {item[titleField] || `Item ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-[#D4AF37] font-sans">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-[#F3E5AB] hover:underline font-bold">
                            ✦ Link
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-[#0A0A0C] px-2.5 py-1 rounded border border-[#D4AF37]/20">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-slate-300 text-sm leading-relaxed mb-3 font-sans">
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
