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
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-end gap-4 mb-10">
        <span className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-zinc-300 dark:text-zinc-700">
          {sectionIndex}
        </span>
        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
          {title}
        </h3>
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest ml-auto self-center">Optional</span>
      </div>

      <div className="space-y-12">
        {data.map((item, index) => (
          <div key={index} className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/80 dark:bg-zinc-900/40 shadow-xl relative focus-within:border-pink-500 transition-colors">
            
            <div className="absolute -top-4 left-6 bg-[var(--neo-bg)] px-4 text-sm font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">
              {itemLabel} {index + 1}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              {fields.map((field) => (
                <div key={field.name} className={`flex flex-col ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.name} 
                      value={item[field.name] ?? ''} 
                      onChange={(e) => onChange(index, e)}
                      placeholder={field.placeholder || ''}
                      rows={field.rows || 3}
                      className="bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-lg text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none"
                    ></textarea>
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      name={field.name} 
                      value={item[field.name] ?? ''} 
                      onChange={(e) => onChange(index, e)}
                      placeholder={field.placeholder || ''}
                      className="bg-transparent border-b border-zinc-300 dark:border-zinc-800 text-xl text-[var(--neo-text)] py-2 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
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
        className="mt-10 px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-xl shadow-sm cursor-pointer"
      >
        + Add {itemLabel}
      </button>
    </section>
  );
};

export default DynamicSectionForm;
