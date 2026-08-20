import React from 'react';

const DynamicSection = ({ title, data, schema }) => {
  if (!data || data.length === 0) return null;

  const descriptionFields = schema.fields.filter(f => f.type === 'textarea').map(f => f.name);
  const titleField = schema.fields[0].name;
  const otherFields = schema.fields.filter(f => f.name !== titleField && !descriptionFields.includes(f.name));

  const isTagList = descriptionFields.length === 0 && otherFields.length === 0;

  return (
    <section className="py-12 border-t border-[#E5E0D8]">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-[#2A2927] mb-8 font-serif">
          {title}
        </h2>
        
        {isTagList ? (
          <div className="flex flex-wrap gap-3">
            {data.map((item, index) => {
              const val = item[titleField];
              if (!val) return null;
              return (
                <span key={index} className="px-4 py-2 bg-white border border-[#E5E0D8] rounded-full text-xs text-[#3E3C38] font-semibold shadow-sm">
                  {val}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((item, index) => (
              <div key={index} className="p-6 border border-[#E5E0D8] rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-serif font-bold text-[#2A2927] mb-2">
                  {item[titleField] || `Item ${index + 1}`}
                </h3>
                
                {otherFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 text-xs text-[#78756F]">
                    {otherFields.map(field => {
                      const value = item[field.name];
                      if (!value) return null;
                      if (field.type === 'url') {
                        return (
                          <a key={field.name} href={value} target="_blank" rel="noopener noreferrer" className="text-[#3E3C38] hover:underline font-bold">
                            Link &rarr;
                          </a>
                        );
                      }
                      return (
                        <span key={field.name} className="bg-[#F6F4EF] px-2.5 py-1 rounded border border-[#E5E0D8]">
                          {value}
                        </span>
                      );
                    })}
                  </div>
                )}
                
                {descriptionFields.map(field => {
                  if (!item[field]) return null;
                  return (
                    <p key={field} className="text-[#55524D] text-sm leading-relaxed mb-3">
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
