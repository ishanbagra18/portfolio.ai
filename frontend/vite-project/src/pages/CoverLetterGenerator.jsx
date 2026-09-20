import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProGate from '../components/ProGate';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function CoverLetterGenerator() {
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [company, setCompany] = useState('Stripe');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(`Dear Hiring Manager at ${company},\n\nI am writing to express my strong enthusiasm for the ${jobTitle} role. Having built production-grade full-stack web applications and AI-driven platforms, I am confident that my technical skills and passion for engineering align perfectly with your team's mission.\n\nIn my recent projects, I have consistently delivered robust code, optimized application performance, and designed intuitive user interfaces. I bring a strong problem-solving mindset and a track record of rapid execution.\n\nThank you for your time and consideration. I would welcome the opportunity to discuss how my background can contribute to ${company}.\n\nSincerely,\n[Your Name]`);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        <h1 className="text-3xl font-display font-black tracking-tight mb-2">AI Cover Letter Generator</h1>
        <p className="text-sm opacity-70 mb-8">Generate tailored, high-converting cover letters matching target job descriptions.</p>

        <ProGate feature="cover_letter" title="AI Cover Letter Generator Locked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-white/60 mb-1 block">TARGET JOB TITLE</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-white/60 mb-1 block">COMPANY NAME</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate AI Cover Letter'}
              </Button>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase">Generated Output</span>
                  {generated && (
                    <button onClick={handleCopy} className="text-xs text-white/70 hover:text-white flex items-center gap-1">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                  {generated || 'Your AI-generated cover letter will appear here...'}
                </p>
              </div>
            </div>
          </div>
        </ProGate>
      </main>

      <Footer />
    </div>
  );
}
