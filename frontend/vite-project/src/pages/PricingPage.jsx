import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingTable from '../components/PricingTable';
import FaqAccordion from '../components/FaqAccordion';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 w-full flex-grow">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold font-mono uppercase tracking-widest mb-4">
            ⚡ Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight mb-4">
            Unlock Full Career Potential
          </h1>
          <p className="text-base sm:text-lg text-[var(--neo-text)]/70">
            Start for free, upgrade when you are ready to land your dream role with custom domains, AI tools, and recruiter analytics.
          </p>
        </div>

        <PricingTable />

        <div className="mt-20">
          <FaqAccordion />
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
