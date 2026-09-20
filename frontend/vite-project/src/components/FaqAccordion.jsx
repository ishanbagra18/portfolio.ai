import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does the AI portfolio generator work?',
    a: 'Simply upload your PDF resume or connect your GitHub profile. Our AI engine parses your work experience, projects, tech stack, and certifications, and automatically formats them into production-ready responsive layouts.'
  },
  {
    q: 'Can I reorder sections and customize colors?',
    a: 'Yes! Every template features a built-in Section Reorder tool (drag and drop) and a Theme Customizer (primary color, accent color, fonts, border radius) that updates the live preview in real time.'
  },
  {
    q: 'How does the ATS Resume Checker work?',
    a: 'Our ATS Scanner checks your resume text against job description keywords, measuring keyword density, readability, formatting compliance, and impact verbs to ensure your resume passes recruiter screeners.'
  },
  {
    q: 'Can I connect a custom domain to my portfolio site?',
    a: 'Absolutely. Pro users can connect any custom domain (e.g., yourname.com) with automatic SSL certificates and global edge CDN hosting.'
  },
  {
    q: 'Is there a free plan available?',
    a: 'Yes! The Starter plan is 100% free forever and includes up to 3 active portfolios, standard templates, and instant subdomain publishing.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold text-violet-600 dark:text-violet-300 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-4">
            Everything You Need To Know
          </h2>
          <p className="text-zinc-600 dark:text-white/70 text-sm sm:text-base font-medium">
            Have questions about templates, custom domains, or ATS scoring? We’ve got answers.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] shadow-sm dark:shadow-none backdrop-blur-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-zinc-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center shrink-0 text-zinc-600 dark:text-white/70"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="px-6 pb-6 text-sm text-zinc-600 dark:text-white/70 leading-relaxed border-t border-zinc-100 dark:border-white/5 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
