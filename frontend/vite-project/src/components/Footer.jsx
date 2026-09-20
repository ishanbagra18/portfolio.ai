import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, History, ExternalLink, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHANGELOG = [

  {
    version: 'v3.2.0',
    date: 'September 2026',
    title: 'Google & GitHub OAuth + Hero Product Demo',
    features: [
      'Added Google & GitHub 1-click OAuth authentication',
      'Interactive Hero product sequence (Resume drop → AI scan → Live site assembly)',
      'Added Free vs Pro pricing table and collapsible FAQ accordion',
      'Added "Built with Portfolio.io" watermark badge for published sites'
    ]
  },
  {
    version: 'v3.1.0',
    date: 'September 2026',
    title: 'Universal Live Preview & Section Order Customizer',
    features: [
      'Refactored Templates 1-20 to support instant live preview reactivity',
      'Drag & Drop section reordering across all 20 templates',
      'Real-time Theme Customizer (primary color, accent, fonts, border-radius)',
      'Added ATS Resume Scanner & Job Matcher AI backend suite'
    ]
  },
  {
    version: 'v3.0.0',
    date: 'August 2026',
    title: 'Multi-Template Engine Release',
    features: [
      'Initial release of 20 production-grade developer templates',
      'Supabase database integration & JWT authentication',
      'Private portfolio passcode links and link expiry'
    ]
  }
];

export default function Footer() {
  const [changelogOpen, setChangelogOpen] = useState(false);

  return (
    <footer className="z-10 w-full border-t border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl relative font-sans text-zinc-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <Link
              to="/home"
              className="text-2xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 inline-block mb-3"
            >
              PORTFOLIO.AI
            </Link>
            <p className="text-xs text-zinc-600 dark:text-white/60 leading-relaxed mb-4">
              AI-powered layout engine & production-ready portfolio builder for modern tech talent.
            </p>
            <button
              onClick={() => setChangelogOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-mono font-bold text-pink-600 dark:text-pink-300 transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>Changelog v3.2.0</span>
            </button>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-white/70">
              <li><Link to="/viewtemplates" className="hover:text-zinc-900 dark:hover:text-white transition">Template Library</Link></li>
              <li><Link to="/my-portfolios" className="hover:text-zinc-900 dark:hover:text-white transition">My Portfolios</Link></li>
              <li><Link to="/career-tools" className="hover:text-zinc-900 dark:hover:text-white transition">Career Tools</Link></li>
              <li><Link to="/ats-checker" className="hover:text-zinc-900 dark:hover:text-white transition">ATS Resume Checker</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-white/70">
              <li><Link to="/home" className="hover:text-zinc-900 dark:hover:text-white transition">Documentation</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition inline-flex items-center gap-1">Open Source <ExternalLink className="w-3 h-3" /></a></li>
              <li><button onClick={() => setChangelogOpen(true)} className="hover:text-zinc-900 dark:hover:text-white transition">Release Notes</button></li>
            </ul>
          </div>

          {/* Col 4: Community & Socials */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-4">Connect</h4>
            <div className="flex items-center gap-3 mb-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/15 transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/15 transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/15 transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-white/40">Built with React 19, Supabase, Express & TailwindCSS.</p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-white/50">
          <p>© {new Date().getFullYear()} Portfolio.io. All rights reserved.</p>
          <p>Crafted with ❤️ for Developers & Designers worldwide.</p>
        </div>
      </div>

      {/* Changelog Modal */}
      <AnimatePresence>
        {changelogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl rounded-3xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto text-zinc-900 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-lg font-display">
                  <Sparkles className="w-5 h-5" />
                  Product Changelog & Updates
                </div>
                <button
                  onClick={() => setChangelogOpen(false)}
                  className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/15 text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                {CHANGELOG.map((item, idx) => (
                  <div key={idx} className="border-b border-zinc-100 dark:border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{item.version}</span>
                      <span className="text-xs text-pink-600 dark:text-pink-400 font-mono">{item.date}</span>
                    </div>
                    <h5 className="text-sm font-semibold text-zinc-800 dark:text-white/90 mb-3">{item.title}</h5>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-white/70 list-disc list-inside">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
