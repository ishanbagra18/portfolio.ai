import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { API_BASE } from '../lib/api';

const ViewTemplates = () => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});
  const [likedTemplates, setLikedTemplates] = useState({});

  useEffect(() => {
    // Fetch likes from backend
    const fetchLikes = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/templates/likes`);
        const result = await res.json();
        if (res.ok && result.success) {
          const likesMap = {};
          result.likes.forEach(l => {
            likesMap[l.template_id] = l.likes_count;
          });
          setLikes(likesMap);
        }
      } catch (err) {
        console.error("Failed to fetch template likes:", err);
      }
    };
    fetchLikes();

    // Load local liked state
    const localLiked = JSON.parse(localStorage.getItem('likedTemplates') || '{}');
    setLikedTemplates(localLiked);
  }, []);

  const handleLike = async (templateId, e) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedTemplates[templateId];
    
    // Optimistic UI update
    setLikes(prev => ({ 
      ...prev, 
      [templateId]: Math.max(0, (prev[templateId] || 0) + (isCurrentlyLiked ? -1 : 1)) 
    }));
    
    const newLiked = { ...likedTemplates, [templateId]: !isCurrentlyLiked };
    setLikedTemplates(newLiked);
    localStorage.setItem('likedTemplates', JSON.stringify(newLiked));

    // Send to backend
    try {
      await fetch(`${API_BASE}/api/templates/like/${templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: isCurrentlyLiked ? 'unlike' : 'like' })
      });
    } catch (err) {
      console.error("Failed to toggle template like:", err);
    }
  };
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
    },
    {
      id: 'template7',
      number: '07',
      name: 'Aurora Glass',
      description: 'A sleek, frosted glassmorphism style with vibrant glowing auroras and soft ambient highlights.',
      previewLink: '/portfolio/template7',
      dataLink: '/provide-data/template7'
    },
    {
      id: 'template8',
      number: '08',
      name: 'Cyberpunk Hacker',
      description: 'A high-contrast cybernetic terminal featuring neon highlights, command-line headers, and monospace code blocks.',
      previewLink: '/portfolio/template8',
      dataLink: '/provide-data/template8'
    },
    {
      id: 'template9',
      number: '09',
      name: 'Retro CRT Console',
      description: 'A vintage green-on-black command line layout with retro CRT styling, cursor blinks, and ASCII accents.',
      previewLink: '/portfolio/template9',
      dataLink: '/provide-data/template9'
    },
    {
      id: 'template10',
      number: '10',
      name: 'Sage Botanical',
      description: 'A serene organic layout with sage green and cream tones, serif display typography, and smooth curved shapes.',
      previewLink: '/portfolio/template10',
      dataLink: '/provide-data/template10'
    },
    {
      id: 'template11',
      number: '11',
      name: 'Newspaper Chronicles',
      description: 'A classic printed broadsheet theme with columnized layouts, drop-cap initials, and aged newsprint tones.',
      previewLink: '/portfolio/template11',
      dataLink: '/provide-data/template11'
    },
    {
      id: 'template12',
      number: '12',
      name: 'Constructivist Swiss',
      description: 'An asymmetrical Swiss graphic layout utilizing bold primary red, solid black geometric blocks, and massive sans-serif type.',
      previewLink: '/portfolio/template12',
      dataLink: '/provide-data/template12'
    },
    {
      id: 'template13',
      number: '13',
      name: '8-Bit Arcade',
      description: 'A nostalgic retro game style with pixel-art box borders, health-bar skill meters, and game dialog containers.',
      previewLink: '/portfolio/template13',
      dataLink: '/provide-data/template13'
    },
    {
      id: 'template14',
      number: '14',
      name: 'Tactical HUD',
      description: 'A technical sci-fi blueprint design with sensor grids, border crosshairs, telemetry charts, and thin coordinate borders.',
      previewLink: '/portfolio/template14',
      dataLink: '/provide-data/template14'
    },
    {
      id: 'template15',
      number: '15',
      name: 'Soft Claymorphism',
      description: 'A playful, modern 3D clay style featuring pastel hues, bulbous borders, and soft inner shadows.',
      previewLink: '/portfolio/template15',
      dataLink: '/provide-data/template15'
    },
    {
      id: 'template16',
      number: '16',
      name: 'Vaporwave Synth',
      description: 'An 80s retrowave aesthetic featuring magenta/cyan dual glow gradients, synth grid lines, and neon badges.',
      previewLink: '/portfolio/template16',
      dataLink: '/provide-data/template16'
    },
    {
      id: 'template17',
      number: '17',
      name: 'Minimalist Monolith',
      description: 'An ultra-modern titanium slate layout with clean borders, glassmorphic panels, and refined typography.',
      previewLink: '/portfolio/template17',
      dataLink: '/provide-data/template17'
    },
    {
      id: 'template18',
      number: '18',
      name: 'Nordic Minimalist Light',
      description: 'A serene Scandinavian design with warm beige, eggshell white, charcoal serif type, and airy spacing.',
      previewLink: '/portfolio/template18',
      dataLink: '/provide-data/template18'
    },
    {
      id: 'template19',
      number: '19',
      name: 'Terminal Matrix Green',
      description: 'A phosphorescent cyberpunk hacker terminal featuring electric emerald matrix code, prompt headers, and shell boxes.',
      previewLink: '/portfolio/template19',
      dataLink: '/provide-data/template19'
    },
    {
      id: 'template20',
      number: '20',
      name: 'Luxury Gold Velvet',
      description: 'A high-end obsidian theme featuring champagne gold accents, delicate borders, luxury serif display type, and golden ambient glows.',
      previewLink: '/portfolio/template20',
      dataLink: '/provide-data/template20'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-aurora text-[var(--neo-text)] font-sans relative overflow-x-hidden"
    >
      <div className="noise-overlay" />
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-12 sm:py-24 relative z-10">
        
        <div className="flex flex-col mb-12 sm:mb-20 pb-6 sm:pb-8 border-b border-black/10 dark:border-white/10">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-[var(--neo-text)] uppercase tracking-tighter leading-none">
            Select Your
          </h1>
          <h2
            className="text-3.5xl sm:text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mt-2"
            style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)', color: 'transparent' }}
          >
            Template.
          </h2>
          <p className="mt-4 sm:mt-8 text-base sm:text-xl opacity-80 max-w-2xl font-medium">
            Choose a design that matches your vibe. You can preview the layout or jump straight into providing your data to generate your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {templates.map((template) => (
            <GlassCard 
              key={template.id} 
              className="group flex flex-col justify-between p-6 sm:p-8 hover:border-accent-color/50 transition-colors duration-500"
            >
              <div>
                <span 
                  className="text-5xl font-display font-black tracking-tighter leading-none mb-6 block opacity-50 transition-opacity group-hover:opacity-100"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}
                >
                  {template.number}
                </span>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-display font-bold text-[var(--neo-text)] group-hover:text-accent-color transition-colors duration-300">
                    {template.name}
                  </h3>
                  
                  {/* Like Button */}
                  <button 
                    onClick={(e) => handleLike(template.id, e)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                      likedTemplates[template.id] 
                        ? 'text-pink-500 bg-pink-500/10' 
                        : 'text-zinc-500 hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={likedTemplates[template.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                    <span className="text-xs font-bold">{likes[template.id] || 0}</span>
                  </button>
                </div>
                <p className="opacity-80 mb-10 text-sm leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-black/10 dark:border-white/10">
                <Button 
                  onClick={() => navigate(template.previewLink)}
                  variant="neo"
                  className="flex-1 text-xs  " 
                >
                  Preview
                </Button>
                <Button 
                  onClick={() => navigate(template.dataLink, { state: { templateId: template.id } })}
                  variant="primary"
                  className="flex-1 text-xs hover:bg-pink-500/50"
                >
                  Provide Data
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default ViewTemplates;