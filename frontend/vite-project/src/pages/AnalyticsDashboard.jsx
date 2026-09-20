import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProGate from '../components/ProGate';
import { Eye, Users, Clock, Globe, HelpCircle, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        <h1 className="text-3xl font-display font-black tracking-tight mb-2">Portfolio Analytics & Insights</h1>
        <p className="text-sm opacity-70 mb-8">Real-time visitor performance, referrer sources, and recruiter chatbot question metrics.</p>

        <ProGate feature="analytics" title="Pro Analytics Locked">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>TOTAL VIEWS</span>
                <Eye className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-white">1,248</div>
              <div className="text-xs text-emerald-400 font-mono mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this week
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>UNIQUE VISITORS</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">842</div>
              <div className="text-xs text-emerald-400 font-mono mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12.1% this week
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>AVG TIME ON PAGE</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">3m 14s</div>
              <div className="text-xs text-cyan-400 font-mono mt-2">High engagement</div>
            </div>
          </div>

          {/* Referrers & Chatbot Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-pink-400" />
                Top Traffic Referrers
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'GitHub Profile', count: 432, pct: '34.6%' },
                  { name: 'LinkedIn Posts', count: 388, pct: '31.1%' },
                  { name: 'Direct Link', count: 210, pct: '16.8%' },
                  { name: 'Twitter / X', count: 140, pct: '11.2%' }
                ].map((r, i) => (
                  <li key={i} className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-white/90 font-medium">{r.name}</span>
                    <span className="font-mono font-bold text-pink-400">{r.count} ({r.pct})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                Recruiter Chatbot Questions
              </h3>
              <div className="text-xs font-mono text-white/50 mb-3">TOP QUESTIONS ASKED BY RECRUITERS</div>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5">💬 "What tech stack did you use for the AI project?"</li>
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5">💬 "Are you open to full-time remote roles?"</li>
                <li className="p-2.5 rounded-xl bg-black/30 border border-white/5">💬 "What is your expected compensation range?"</li>
              </ul>
            </div>
          </div>
        </ProGate>
      </main>

      <Footer />
    </div>
  );
}
