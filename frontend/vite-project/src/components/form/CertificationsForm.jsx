import React from 'react';

const CertificationsForm = ({ data, onChange, onAdd }) => {
  return (
    <section className="py-20 border-b border-gray-900">
      <div className="flex items-end gap-4 mb-16">
        <span 
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
        >
          05
        </span>
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Certifications
        </h3>
      </div>

      <div className="space-y-12">
        {data.map((cert, index) => (
          <div key={index} className="p-8 border border-gray-800 rounded-lg relative focus-within:border-white transition-colors">
            
            <div className="absolute -top-4 left-6 bg-black px-4 text-sm font-bold text-gray-500 tracking-widest">
              CERTIFICATE {index + 1}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Certification Name</label>
                <input 
                  type="text" name="certification_name" value={cert.certification_name ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Machine Learning and Statistics"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Issuing Organization</label>
                <input 
                  type="text" name="issuing_organization" value={cert.issuing_organization ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="e.g. Coursera"
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Credential URL</label>
                <input 
                  type="text" name="credential_url" value={cert.credential_url ?? ''} onChange={(e) => onChange(index, e)}
                  placeholder="https://..."
                  className="bg-transparent border-b border-gray-800 text-xl text-white py-2 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" onClick={onAdd}
        className="mt-10 px-6 py-3 border border-gray-600 text-gray-300 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-white transition-all"
      >
        + Add Certification
      </button>
    </section>
  );
};

export default CertificationsForm;