import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, Sparkles, Layout, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template-1');

  const handleFileUpload = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setParsing(true);
      setTimeout(() => {
        setParsing(false);
        setStep(2);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-white/50 mb-3">
            <span>STEP {step} OF 4</span>
            <span>{step === 1 ? 'Upload Resume' : step === 2 ? 'Select Theme' : step === 3 ? 'AI Review' : 'Publish'}</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight mb-4">
              Upload Your Resume
            </h1>
            <p className="text-sm opacity-70 mb-8">
              Drop your PDF resume to let AI parse your work experience, skills, and projects automatically.
            </p>

            <label className="border-2 border-dashed border-pink-500/40 hover:border-pink-500 bg-white/5 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors block">
              <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-white mb-1">
                {file ? file.name : 'Click or Drag PDF Resume here'}
              </p>
              <p className="text-xs text-white/50">Supports PDF, DOCX up to 10MB</p>
            </label>

            {parsing && (
              <div className="mt-6 flex items-center justify-center gap-2 text-pink-400 font-mono text-xs font-bold animate-pulse">
                <Sparkles className="w-4 h-4" />
                AI is parsing experience, projects & skills...
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-black mb-2">Pick Your Design Theme</h1>
              <p className="text-sm opacity-70">Choose a layout optimized for your technical role.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {['template-1', 'template-2', 'template-3'].map((tmpl, idx) => (
                <div
                  key={tmpl}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedTemplate === tmpl
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10 scale-105'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="h-32 bg-black/40 rounded-xl mb-3 flex items-center justify-center text-xs font-mono text-white/40">
                    Theme {idx + 1} Preview
                  </div>
                  <div className="font-bold text-sm text-white">Template {idx + 1}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="neo" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">Next: AI Review <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl font-display font-black mb-4">AI Extraction Complete!</h1>
            <p className="text-sm opacity-70 mb-8">We successfully extracted 6 skills, 3 projects, and 2 work experiences.</p>
            <Button onClick={() => navigate('/provide-data')} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3.5 font-bold">
              Open Portfolio Editor <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
