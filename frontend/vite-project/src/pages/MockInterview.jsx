import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProGate from '../components/ProGate';
import { Mic, Send, Sparkles, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function MockInterview() {
  const [answer, setAnswer] = useState('');
  const [evaluated, setEvaluated] = useState(null);
  const [loading, setLoading] = useState(false);

  const question = "Tell me about a complex architectural decision you made in a recent project. What were the trade-offs?";

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setEvaluated({
        score: 92,
        feedback: [
          'Great use of the STAR method to structure your response',
          'Clear technical depth regarding system scalability trade-offs',
          'Demonstrated strong problem-solving ownership'
        ],
        tip: 'Consider mentioning error monitoring or APM tools (e.g. Datadog, Sentry) next time.'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        <h1 className="text-3xl font-display font-black tracking-tight mb-2">AI Mock Technical Interview</h1>
        <p className="text-sm opacity-70 mb-8">Practice real-time technical interview questions with instant AI feedback.</p>

        <ProGate feature="mock_interview" title="AI Mock Interview Simulator Locked">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-6 shadow-2xl">
            <div className="text-xs font-mono font-bold text-pink-400 uppercase mb-2">QUESTION 1 OF 4</div>
            <h2 className="text-xl font-bold text-white mb-6 leading-snug">{question}</h2>

            <textarea
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here using the STAR method..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-pink-500 mb-4"
            />

            <div className="flex justify-between items-center">
              <button className="text-xs font-bold text-white/50 hover:text-white flex items-center gap-1.5 p-2 rounded-xl bg-white/5">
                <Mic className="w-4 h-4 text-pink-400" /> Voice Input (Optional)
              </button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Evaluating...' : 'Submit Answer for AI Evaluation'}
              </Button>
            </div>
          </div>

          {evaluated && (
            <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-pink-500/30 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" /> AI Feedback Summary
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm">
                  SCORE: {evaluated.score} / 100
                </span>
              </div>
              <ul className="space-y-2 text-xs text-white/90 mb-4">
                {evaluated.feedback.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">✨ {f}</li>
                ))}
              </ul>
              <div className="text-xs text-pink-300 font-mono">💡 Pro Tip: {evaluated.tip}</div>
            </div>
          )}
        </ProGate>
      </main>

      <Footer />
    </div>
  );
}
