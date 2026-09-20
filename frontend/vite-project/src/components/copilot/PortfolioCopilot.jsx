// added chatbot acc to the website



import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Bot, Command, ArrowRight, ShieldAlert, CheckCircle2, Lock, Target } from 'lucide-react';
import { API_BASE } from '../../lib/api';

const ROUTES = {
  home: '/home',
  templates: '/viewtemplates',
  my_portfolios: '/my-portfolios',
  ats_checker: '/ats-checker',
  career_tools: '/career-tools',
  profile: '/profile',
  billing: '/settings/billing',
  pricing: '/pricing',
  job_tracker: '/applications',
  cover_letter: '/career-tools/cover-letter',
  interview: '/career-tools'
};

export default function PortfolioCopilot({ onSpotlight }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi! I'm **Portfolio Copilot**. Ask me how to publish, switch themes, navigate anywhere, or change settings!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll chat thread
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Route-aware suggestion chips
  const getSuggestions = () => {
    const path = location.pathname;
    if (path.startsWith('/edit-portfolio')) {
      return [
        "How do I reorder sections?",
        "Switch to dark mode",
        "Show me where the save button is",
        "How do I publish my portfolio?"
      ];
    }
    if (path === '/pricing' || path === '/settings/billing') {
      return [
        "What's included in Pro?",
        "How many AI credits do I have left?",
        "Take me to my portfolios",
        "Switch to dark mode"
      ];
    }
    if (path === '/my-portfolios' || path === '/my-portfolio') {
      return [
        "Make my portfolio private",
        "Show me where the share button is",
        "How do I create a custom link?",
        "Take me to templates"
      ];
    }
    return [
      "How do I publish my portfolio?",
      "Take me to templates",
      "Show AI credits remaining",
      "Switch to dark mode"
    ];
  };

  // Client Action Registry
  const executeClientAction = (action) => {
    if (!action || !action.name) return;

    const { name, args } = action;

    if (name === 'navigate' && args?.page) {
      const targetRoute = ROUTES[args.page] || '/home';
      navigate(targetRoute);
    } else if (name === 'open_editor' && args?.portfolioId) {
      navigate(`/edit-portfolio/${args.portfolioId}`);
    } else if (name === 'set_theme' && args?.mode) {
      if (args.mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } else if (name === 'spotlight_element' && args?.elementId) {
      if (onSpotlight) {
        onSpotlight(args.elementId);
      }
    } else if (name === 'requires_upgrade') {
      navigate('/pricing');
    }
  };

  const handleSendMessage = async (queryText, confirmPayload = null) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() && !confirmPayload) return;

    if (!confirmPayload) {
      setInput('');
      setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    }
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/ai/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          currentRoute: location.pathname,
          confirmAction: confirmPayload
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: data.text,
            action: data.action,
            needsConfirmation: data.needsConfirmation,
            confirmationPayload: data.confirmationPayload
          }
        ]);

        if (data.needsConfirmation && data.confirmationPayload) {
          setPendingConfirmation(data.confirmationPayload);
        } else {
          setPendingConfirmation(null);
        }

        if (data.action) {
          executeClientAction(data.action);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: data.message || "Failed to communicate with Portfolio Copilot." }
        ]);
      }
    } catch (err) {
      console.error("Copilot error:", err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: "Network error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (pendingConfirmation) {
      const payload = pendingConfirmation;
      setPendingConfirmation(null);
      handleSendMessage("Confirmed", payload);
    }
  };

  return (
    <>
      {/* Floating Copilot Button (Bottom-Right Small Circle Only) */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(236,72,153,0.5)] hover:shadow-[0_12px_35px_rgba(236,72,153,0.8)] transition-all duration-300 backdrop-blur-xl border border-white/25 cursor-pointer group"
        title="Portfolio Copilot AI (Cmd+K)"
        data-assist-id="copilot-floating-btn"
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white stroke-[2.5]" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950 shadow-sm" />
            </>
          )}
        </div>
      </motion.button>

      {/* Copilot Assistant Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative pointer-events-auto w-full sm:w-[460px] h-[580px] max-h-[90vh] glass-panel bg-zinc-900/95 border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden sm:right-6 sm:bottom-20"
            >
              {/* Top Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                      Portfolio Copilot
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 rounded border border-pink-500/30 uppercase">
                        AI Assistant
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">Ask questions, control app settings & navigate</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none shadow-md font-medium'
                          : 'bg-zinc-800/90 border border-white/10 text-zinc-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Action Card Badge */}
                    {msg.action && (
                      <div className="mt-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Executed Action: <span className="font-mono text-emerald-200">{msg.action.name}</span>
                      </div>
                    )}

                    {/* Confirmation UI Card */}
                    {msg.needsConfirmation && pendingConfirmation && (
                      <div className="mt-2 w-full max-w-[88%] p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2">
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Confirmation Required
                        </div>
                        <p className="text-[11px] text-amber-200/90">{msg.confirmationPayload?.prompt || "Please confirm this action."}</p>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={handleConfirmAction}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition text-[11px]"
                          >
                            Confirm Action
                          </button>
                          <button
                            onClick={() => setPendingConfirmation(null)}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-zinc-400 text-xs italic">
                    <Bot className="w-3.5 h-3.5 animate-spin text-pink-400" />
                    Portfolio Copilot is processing...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Route-Aware Suggestion Chips */}
              <div className="px-4 py-2 bg-zinc-950/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
                {getSuggestions().map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 rounded-lg text-[10px] font-medium text-zinc-300 hover:text-pink-300 transition whitespace-nowrap shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-white/10 bg-zinc-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Copilot or type a command..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-zinc-800/80 border border-white/10 focus:border-pink-500/50 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
