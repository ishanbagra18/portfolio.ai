import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowUp, ArrowDown, GripVertical, Layers } from 'lucide-react';

const DEFAULT_SECTIONS = [
  { id: 'about', label: 'About & Bio' },
  { id: 'projects', label: 'Projects' },
  { id: 'experiences', label: 'Work Experience' },
  { id: 'tech_stacks', label: 'Tech Stacks' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blog_posts', label: 'Blog & Articles' },
  { id: 'case_studies', label: 'Case Studies' },
  { id: 'testimonials_data', label: 'Testimonials' },
  { id: 'education_data', label: 'Education' },
  { id: 'achievements_data', label: 'Achievements' },
  { id: 'hackathons_data', label: 'Hackathons' },
  { id: 'open_source_data', label: 'Open Source' }
];

export default function SectionOrderCustomizer({ 
  sectionOrder = [], 
  sectionVisibility = {}, 
  onOrderChange, 
  onVisibilityToggle 
}) {
  // Merge missing default sections into current section order
  const currentOrder = React.useMemo(() => {
    const rawOrder = Array.isArray(sectionOrder) ? sectionOrder : [];
    const list = [...(rawOrder.length ? rawOrder : DEFAULT_SECTIONS.map(s => s.id))];
    DEFAULT_SECTIONS.forEach(s => {
      if (!list.includes(s.id)) list.push(s.id);
    });
    return list;
  }, [sectionOrder]);

  const moveSection = (index, direction) => {
    const newOrder = [...currentOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    onOrderChange(newOrder);
  };

  const getLabel = (id) => {
    const item = DEFAULT_SECTIONS.find(s => s.id === id);
    return item ? item.label : id.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-[var(--neo-text)]">Section Layout & Order</h3>
        </div>
        <span className="text-xs text-[var(--neo-text)]/60 font-mono">
          Reorder & Toggle Visibility
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {currentOrder.map((sectionId, idx) => {
            const isVisible = sectionVisibility[sectionId] !== false; // Visible by default

            return (
              <motion.div
                key={sectionId}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                  isVisible 
                    ? 'bg-white/5 border-white/10 text-[var(--neo-text)]' 
                    : 'bg-black/20 border-white/5 text-[var(--neo-text)]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 opacity-40 cursor-grab active:cursor-grabbing" />
                  <span className="text-sm font-semibold font-sans">
                    {idx + 1}. {getLabel(sectionId)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Up / Down Controls */}
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === currentOrder.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Show / Hide Toggle */}
                  <button
                    type="button"
                    onClick={() => onVisibilityToggle(sectionId, !isVisible)}
                    className={`ml-2 p-1.5 rounded-lg transition-colors ${
                      isVisible 
                        ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    }`}
                    title={isVisible ? 'Hide Section' : 'Show Section'}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
