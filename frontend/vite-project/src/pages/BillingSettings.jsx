import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEntitlements } from '../hooks/useEntitlements';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function BillingSettings() {
  const navigate = useNavigate();
  const { plan, isPro, usages, loading } = useEntitlements();

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-20 w-full flex-grow">
        <h1 className="text-3xl font-display font-black tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-sm opacity-70 mb-8">Manage your subscription tier, monthly usage credits, and invoicing history.</p>

        {/* Plan Summary Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest mb-1">Current Plan</div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {isPro ? 'Pro Developer Plan' : 'Free Starter Plan'}
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${isPro ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white/10 text-white/70'}`}>
                  {plan}
                </span>
              </h2>
            </div>

            {!isPro ? (
              <Button
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro ($12/mo)
              </Button>
            ) : (
              <Button
                variant="neo"
                onClick={() => alert('Opening Stripe Portal...')}
                className="text-xs font-bold px-5 py-2.5 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Manage Invoices & Billing
              </Button>
            )}
          </div>

          {/* Monthly Usage Counters */}
          <div className="pt-6">
            <h3 className="text-sm font-bold text-white mb-4">Monthly Credit Usage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60">AI Enhancements</span>
                  <span className="font-bold text-pink-400">{usages.ai_enhancement?.used || 0} / {isPro ? '∞' : 10}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full transition-all" style={{ width: isPro ? '100%' : `${Math.min(100, ((usages.ai_enhancement?.used || 0) / 10) * 100)}%` }} />
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60">ATS Resume Scans</span>
                  <span className="font-bold text-pink-400">{usages.ats_scanner?.used || 0} / {isPro ? '∞' : 3}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: isPro ? '100%' : `${Math.min(100, ((usages.ats_scanner?.used || 0) / 3) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
