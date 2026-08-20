import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-24 bg-black border-t border-[#115511]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#33FF33] mb-16">
          {title}
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-4">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-5 py-2 bg-[#051105] border-[#115511] border rounded-full text-base text-[#33FF33] font-medium hover:scale-105 transition-transform cursor-default shadow-sm">
                  {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((item, index) => (
              <div key={index} className="p-8 border border-[#115511] rounded-2xl bg-[#051105] transition-all hover:-translate-y-1 shadow-sm">
                <h3 className="text-2xl font-bold text-[#33FF33] mb-3">
                  {item[titleField] || `Item ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-sm text-[#22AA22] font-mono">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-bold">
                            🔗 Link
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-black px-3 py-1 rounded-md border border-[#115511]">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-[#22AA22] text-base leading-relaxed mb-4">
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
