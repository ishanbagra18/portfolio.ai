import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, X, QrCode, MessageSquare } from 'lucide-react';

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterXIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

import { toast } from 'sonner';

export default function ShareModal({
  url = null,
  title = 'Candidate Portfolio',
  candidateName = 'Developer'
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback to current browser URL if url is not passed
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://portfolio.ai');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Portfolio link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  const shareText = `Check out ${candidateName}'s official developer portfolio on Portfolio.AI!`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: 'from-blue-600 to-indigo-600',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      icon: TwitterXIcon,
      color: 'from-zinc-700 to-zinc-900',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    }
  ];

  return (
    <>
      {/* Trigger Share Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
        title="Share Portfolio Link & QR Code"
      >
        <Share2 className="w-3.5 h-3.5 text-pink-400" />
        <span>Share</span>
      </button>

      {/* Share Drawer Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900 via-slate-950 to-zinc-950 p-6 sm:p-8 shadow-2xl relative text-white font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">Share Portfolio</h3>
                    <span className="text-[11px] font-mono text-zinc-400">{candidateName}</span>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Copy URL Input Box */}
              <div className="mb-6">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Portfolio Public Link
                </label>
                <div className="flex gap-2 bg-black/50 border border-white/10 rounded-2xl p-1.5 pl-3">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-xs text-zinc-200 font-mono focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                      copied
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code Block */}
              <div className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-400" /> Scan QR Code
                </span>
                <div className="p-3 bg-white rounded-2xl shadow-xl inline-block">
                  <QRCodeSVG
                    value={shareUrl}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#09090b"
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                  Scan with smartphone camera to view portfolio
                </p>
              </div>

              {/* Social Share Buttons */}
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-3">
                  Share to Social Networks
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`py-2.5 px-3 rounded-xl bg-gradient-to-r ${social.color} text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition shadow-md`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
