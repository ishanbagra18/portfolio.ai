import React from 'react';
import { Link } from 'react-router-dom';

const ViewTemplates = () => {
  const templates = [
    {
      id: 'template1',
      number: '01',
      name: 'Neon Dark',
      description: 'A sleek dark theme featuring vibrant gradient text and clean card-based layouts. Perfect for a modern tech vibe.',
      previewLink: '/portfolio/template1', 
      dataLink: '/provide-data/template1' 
    },
    {
      id: 'template2',
      number: '02',
      name: 'Bold Minimal',
      description: 'A premium, high-contrast black theme with massive typography and minimalist borders. Leaves a strong impact.',
      previewLink: '/portfolio/template2',
      dataLink: '/provide-data/template2' 
    },
    {
      id: 'template3',
      number: '03',
      name: 'White Elegance',
      description: 'A premium, high-contrast white theme with clean lines and ample whitespace. Exudes sophistication and professionalism.',
      previewLink: '/portfolio/template3',
      dataLink: '/provide-data/template3' 
    },
    {
      id: 'template4',
      number: '04',
      name: 'Blueprint Technical',
      description: 'A navy schematic theme with grid paper, corner brackets, and monospace annotations. Built for engineers who think in diagrams.',
      previewLink: '/portfolio/template4',
      dataLink: '/provide-data/template4' 
    },
    {
      id: 'template5',
      number: '05',
      name: 'Neo Brutalist',
      description: 'A warm scrapbook theme with thick black borders, hard offset shadows, and rotated stickers. Playful, loud, and hard to ignore.',
      previewLink: '/portfolio/template5',
      dataLink: '/provide-data/template5' 
    },
    {
      id: 'template6',
      number: '06',
      name: 'Editorial Gallery',
      description: 'An ivory catalogue theme with serif display type, hairline rules, and gallery plate numbering. Quiet, refined, and confident.',
      previewLink: '/portfolio/template6',
      dataLink: '/provide-data/template6' 
    }
  ];

  return (
    <div className="min-h-screen bg-black w-full flex flex-col font-sans py-24 px-6">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="flex flex-col mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
            Select Your
          </h1>
          <h2
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mt-2"
            style={{ WebkitTextStroke: '2px #374151', color: 'transparent' }}
          >
            Template.
          </h2>
          <p className="mt-8 text-xl text-gray-400 max-w-2xl font-light">
            Choose a design that matches your vibe. You can preview the layout or jump straight into providing your data to generate your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="group flex flex-col justify-between p-8 md:p-12 border border-gray-800 hover:border-white transition-colors duration-500 bg-[#0a0a0a]"
            >
              <div>
                <span 
                  className="text-5xl font-black tracking-tighter leading-none mb-6 block"
                  style={{ WebkitTextStroke: '1px #374151', color: 'transparent' }}
                >
                  {template.number}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {template.name}
                </h3>
                <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link 
                  to={template.previewLink}
                  className="px-6 py-4 bg-transparent border border-gray-600 text-white font-bold uppercase tracking-widest text-sm hover:border-white hover:bg-white hover:text-black transition-all text-center"
                >
                  Preview
                </Link>
                <Link 
                  to={template.dataLink}
                  state={{ templateId: template.id }}
                  className="px-6 py-4 bg-white border border-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all text-center flex-1"
                >
                  Provide Data
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ViewTemplates;