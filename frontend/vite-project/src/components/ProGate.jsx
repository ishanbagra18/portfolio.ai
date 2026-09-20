import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntitlements } from '../hooks/useEntitlements';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export default function ProGate({ feature, children, title = 'Pro Feature Locked', blurContent = true }) {
  const navigate = useNavigate();
  const { isPro, canUseFeature, loading } = useEntitlements();

  const allowed = isPro || canUseFeature(feature);

  if (loading) {
    return <div className="animate-pulse opacity-50 p-4">{children}</div>;
  }

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Blurred background preview */}
      <div className={blurContent ? "blur-md pointer-events-none select-none opacity-40 grayscale" : ""}>
        {children}
      </div>

      {/* Glass Lock Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 border border-pink-500/30 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-pink-500/30">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          {title}
          <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-xs font-mono font-extrabold uppercase">PRO</span>
        </h3>

        <p className="text-xs text-white/70 max-w-sm mb-4">
          Upgrade to Portfolio.io Pro for $12/mo to unlock unlimited access, custom domains, and AI tools.
        </p>

        <Button
          onClick={() => navigate('/pricing')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
