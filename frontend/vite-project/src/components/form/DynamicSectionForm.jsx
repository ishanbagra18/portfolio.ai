import React from 'react';

const DynamicSectionForm = ({ 
  title, 
  sectionIndex, 
  data, 
  onChange, 
  onAdd, 
  fields, 
  itemLabel = 'ITEM'
}) => {
  return (
    <section className="py-20 border-b border-gray-900">
      <div className="flex flex-wrap items-end gap-4 mb-10">
        <span 
          className="text-4xl md:text-6xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          {sectionIndex}
        </span>
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
          {title}
        </h3>
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest ml-auto self-center">Optional</span>
      </div>

      <div className="space-y-12">
        {data.map((item, index) => (
          <div key={index} className="p-8 border border-gray-800 rounded-lg relative focus-within:border-white transition-colors">
            
            <div className="absolute -top-4 left-6 bg-[var(--neo-bg)] px-4 text-sm font-bold text-gray-500 tracking-widest uppercase">
              {itemLabel} {index + 1}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              {fields.map((field) => (
                <div key={field.name} className={`flex flex-col ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.name} 
                      value={item[field.name] ?? ''} 
                      onChange={(e) => onChange(index, e)}
                      placeholder={field.placeholder || ''}
                      rows={field.rows || 3}
                      className="bg-transparent border-b border-gray-800 text-lg text-[var(--neo-text)] py-2 focus:outline-none focus:border-white transition-colors resize-none"
                    ></textarea>
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      name={field.name} 
                      value={item[field.name] ?? ''} 
                      onChange={(e) => onChange(index, e)}
                      placeholder={field.placeholder || ''}
                      className="bg-transparent border-b border-gray-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-white transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        onClick={onAdd}
        className="mt-10 px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all"
      >
        + Add {itemLabel}
      </button>
    </section>
  );
};

export default DynamicSectionForm;
