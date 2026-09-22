import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Sparkles, Rocket, Code, Award, Briefcase, Globe, Plus, X, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

const CATEGORIES = [
  { id: 'project', label: 'New Project', icon: Rocket, color: 'from-pink-500 to-rose-500', text: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  { id: 'tech', label: 'Tech Stack', icon: Code, color: 'from-violet-500 to-purple-500', text: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  { id: 'career', label: 'Career Update', icon: Briefcase, color: 'from-indigo-500 to-blue-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'cert', label: 'Certification', icon: Award, color: 'from-amber-500 to-orange-500', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'deploy', label: 'Portfolio Release', icon: Globe, color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
];

const INITIAL_CHANGELOG = [
  {
    id: 'ch-1',
    category: 'project',
    title: 'Shipped AI SaaS Multi-Tenant Platform',
    date: 'Just now',
    description: 'Built and published full-stack AI SaaS app using React 19, Supabase, Node.js, and TailwindCSS with live payment gating.',
    tags: ['React 19', 'Supabase', 'Node.js', 'Stripe']
  },
  {
    id: 'ch-2',
    category: 'tech',
    title: 'Mastered PyTorch & Gemini AI LLM Pipelines',
    date: '2 days ago',
    description: 'Integrated vector embeddings, RAG indexing, and streaming LLM responses into production applications.',
    tags: ['Python', 'PyTorch', 'Gemini AI', 'FastAPI']
  },
  {
    id: 'ch-3',
    category: 'cert',
    title: 'AWS Certified Solutions Architect (Associate)',
    date: '1 week ago',
    description: 'Completed AWS cloud architecture certification covering VPCs, ECS Docker containers, Serverless Lambda, and DynamoDB.',
    tags: ['AWS', 'Docker', 'Serverless', 'Cloud']
  },
  {
    id: 'ch-4',
    category: 'career',
    title: 'Promoted to Senior Full-Stack Engineer',
    date: '3 weeks ago',
    description: 'Led technical architecture for enterprise dashboard migration, improving page load speed by 45% for 50k DAU.',
    tags: ['Leadership', 'Architecture', 'Performance']
  }
];

export default function RecruiterChangelog({
  candidateName = 'Developer',
  editable = true,
  isOpen = undefined,
  onClose = undefined
}) {
  const [logs, setLogs] = useState(INITIAL_CHANGELOG);
  const [internalOpen, setInternalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const isControlled = isOpen !== undefined;
  const showModal = isControlled ? isOpen : internalOpen;
  const handleClose = () => {
    if (isControlled && onClose) onClose();
    else setInternalOpen(false);
  };

  // Form state for adding new changelog item
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('project');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('React, TypeScript');

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry = {
      id: `ch-${Date.now()}`,
      category,
      title,
      date: 'Just now',
      description,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean)
    };

    setLogs([newEntry, ...logs]);
    setTitle('');
    setDescription('');
    setAddModalOpen(false);
  };

  return (
    <div className="font-sans">
      {/* Trigger Button (only if not controlled externally) */}
      {!isControlled && (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-pink-500/40 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white transition shadow-sm"
          title="Candidate Activity & Recruiter Changelog"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Changelog</span>
          <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[10px] font-mono border border-pink-500/30">
            {logs.length}
          </span>
        </button>
      )}

      {/* Recruiter Changelog Drawer Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900 via-zinc-950 to-slate-950 p-6 sm:p-8 shadow-2xl relative text-white font-sans overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5 shrink-0">
                <div>
                  <div className="text-[11px] font-mono font-bold text-pink-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Recruiter Insights &amp; Updates
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{candidateName}'s Activity Feed</h2>
                </div>

                <div className="flex items-center gap-2">
                  {editable && (
                    <button
                      onClick={() => setAddModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-95 transition shadow-lg"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Update
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Glowing Timeline Content */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                <div className="relative border-l-2 border-pink-500/40 ml-3 space-y-6 pl-5">
                  {logs.map((log) => {
                    const catObj = CATEGORIES.find(c => c.id === log.category) || CATEGORIES[0];
                    const IconComp = catObj.icon;

                    return (
                      <div key={log.id} className="relative group">
                        {/* Timeline Dot Indicator */}
                        <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r ${catObj.color} border-2 border-black shadow-lg shadow-pink-500/30 flex items-center justify-center`}>
                          <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                        </div>

                        {/* Log Card */}
                        <div className="bg-white/5 border border-white/10 hover:border-pink-500/30 rounded-2xl p-4.5 backdrop-blur-xl transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-extrabold uppercase border flex items-center gap-1.5 ${catObj.bg} ${catObj.text}`}>
                              <IconComp className="w-3 h-3" />
                              {catObj.label}
                            </span>
                            <span className="text-xs font-mono text-white/50 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {log.date}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-pink-300 transition-colors">
                            {log.title}
                          </h3>

                          <p className="text-xs text-white/70 leading-relaxed mb-3">
                            {log.description}
                          </p>

                          {/* Tech Tags */}
                          {log.tags && log.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                              {log.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-medium text-white/80">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Activity Log Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-950 p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-pink-400" />
                  Post Candidate Changelog Update
                </h3>
                <button onClick={() => setAddModalOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddLog} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-white/60 mb-1 block">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-white/60 mb-1 block">TITLE / MILESTONE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Added Real-Time Chatbot to Portfolio"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-white/60 mb-1 block">DETAILS FOR RECRUITERS</label>
                  <textarea
                    rows={3}
                    placeholder="Describe key tech stack used, Lighthouse metrics, or impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-white/60 mb-1 block">TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Node.js, AI"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="neo" onClick={() => setAddModalOpen(false)} className="w-1/2 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs">
                    Publish Update
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
