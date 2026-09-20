import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PricingTable() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgradePro = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'guest';

      const response = await fetch(`${API_BASE_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          billingCycle: 'monthly',
          returnUrl: `${window.location.origin}/upgrade/success`
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        navigate('/upgrade/success');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      navigate('/upgrade/success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 relative z-10 font-sans text-white">
      <div className="max-w-6xl mx-auto">

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">

          {/* STARTER / FREE CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-b from-white/[0.05] to-black/60 border border-white/10 backdrop-blur-2xl flex flex-col justify-between relative shadow-2xl"
          >
            <div>
              <h3 className="text-3xl font-extrabold font-display text-white mb-3">Starter / Free</h3>
              <p className="text-sm text-white/70 mb-8 font-medium leading-relaxed max-w-sm">
                Everything you need to launch a professional portfolio site right now.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-6xl font-black font-display text-white tracking-tight">$0</span>
                <span className="text-sm font-mono text-white/50">forever</span>
              </div>

              <div className="border-t border-white/10 pt-6 mb-10 space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Up to 3 Active Portfolios</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Access to Standard Templates (1 - 6)</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Built-in Theme Customizer &amp; Section Order</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Subdomain URL (portfolio.io/p/yourname)</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Basic ATS Resume Score Check</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Includes "Built with Portfolio.io" Badge</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/onboarding')}
              className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* PRO DEVELOPER CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className="rounded-[2.5rem] p-8 sm:p-10 bg-gradient-to-b from-purple-950/40 via-black/80 to-pink-950/40 border-2 border-pink-500/50 backdrop-blur-2xl flex flex-col justify-between relative shadow-2xl shadow-pink-500/15 overflow-hidden"
          >
            {/* MOST POPULAR BADGE */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-mono text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl shadow-md tracking-wider">
                MOST POPULAR
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold font-display text-white mb-3">Pro Developer</h3>
              <p className="text-sm text-white/70 mb-8 font-medium leading-relaxed max-w-sm">
                For ambitious developers, freelancers, and engineers ready to land top roles.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-6xl font-black font-display text-white tracking-tight">$12</span>
                <span className="text-sm font-mono text-white/50">per month</span>
              </div>
              <div className="text-xs text-pink-400 font-mono mb-6 font-semibold">Billed monthly</div>

              <div className="border-t border-white/10 pt-6 mb-10 space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Unlimited Active Portfolios</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Access to All 20+ Premium &amp; AI Templates</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Custom Domain Connection + Automatic SSL</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Remove "Built with Portfolio.io" Watermark</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Unlimited AI Resume Tailoring &amp; ATS Scanner</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Export Portfolio to PDF &amp; React Code</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Priority Global Edge CDN &amp; 99.9% Uptime</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgradePro}
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

