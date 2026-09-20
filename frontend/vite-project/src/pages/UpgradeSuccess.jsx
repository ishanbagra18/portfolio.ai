import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function UpgradeSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire festive celebration confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24 w-full flex-grow text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest mb-4">
          ✨ Upgrade Complete
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-4">
          Welcome to Pro Developer!
        </h1>
        <p className="text-base text-white/70 max-w-xl mx-auto mb-10">
          Your account has been elevated to Pro. All 20+ templates, custom domains, unlimited AI generation, and recruiter lead analytics are now active.
        </p>

        {/* Pro Setup Checklist Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 text-left mb-10 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            Your Pro Setup Checklist
          </h2>

          <ul className="space-y-4 text-sm text-white/90">
            <li className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Globe className="w-5 h-5 text-pink-400 shrink-0" />
              <div>
                <div className="font-bold">Connect Custom Domain</div>
                <div className="text-xs text-white/50">Point your portfolio to your custom URL with free SSL</div>
              </div>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Zap className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold">Remove Portfolio.io Watermark</div>
                <div className="text-xs text-white/50">Toggle off the footer watermark badge in settings</div>
              </div>
            </li>
            <li className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold">Access Recruiter Analytics & Leads</div>
                <div className="text-xs text-white/50">Track visitor time on page and recruiter questions</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => navigate('/provide-data')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-xl shadow-pink-500/25"
          >
            Launch Builder
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="neo"
            onClick={() => navigate('/my-portfolios')}
            className="px-6 py-3.5"
          >
            Go to Dashboard
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
