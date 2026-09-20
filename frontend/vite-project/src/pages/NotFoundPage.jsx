import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Layers, Briefcase, FileCheck, LayoutDashboard, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    { label: 'My Portfolios', path: '/my-portfolios', icon: LayoutDashboard, desc: 'Manage your live portfolios' },
    { label: 'Explore Templates', path: '/viewtemplates', icon: Layers, desc: 'Choose from 20+ designs' },
    { label: 'Career Tools', path: '/career-tools', icon: Briefcase, desc: 'AI Cover Letter & Interview' },
    { label: 'ATS Checker', path: '/ats-checker', icon: FileCheck, desc: 'Optimize your resume score' },
  ];

  const filteredLinks = quickLinks.filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-aurora text-white flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="noise-overlay" />
      <Navbar />

      {/* Background Animated Blobs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -180, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="z-10 max-w-4xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center my-auto w-full">
        {/* Main 404 Glass Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full glass-panel p-8 sm:p-12 border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-2xl rounded-3xl"
        >
          {/* Top Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-pink-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            PORTFOLIO.AI — 404 UNCHARTED TERRITORY
          </div>

          {/* Glowing 404 Header */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="relative mb-4"
          >
            <div className="text-7xl sm:text-[9rem] font-display font-black tracking-tighter bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent leading-none select-none">
              404
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-4xl font-display font-black text-white mb-3 tracking-tight">
            Lost in Digital Space
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto mb-8 font-medium leading-relaxed">
            The page or portfolio link you requested could not be found. It may have been moved, renamed, or deleted.
          </p>

          {/* Interactive Search / Redirect Input */}
          <div className="max-w-md mx-auto mb-8 relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Where do you want to go? (e.g. templates, tools)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-2xl text-sm text-white placeholder-white/40 outline-none transition backdrop-blur-md"
              />
            </div>
          </div>

          {/* Popular Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-8 text-left">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-pink-500/30 transition group flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-white/50">{link.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-center pt-4 border-t border-white/10">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <button
              onClick={() => navigate('/home')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-pink-500/20 hover:opacity-90 transition flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
