import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Template1 from '../Templates/Template1/Template1';
import Template2 from '../Templates/Template2/Template2';
import Template3 from '../Templates/Template3/Template3';
import Template4 from '../Templates/Template4/Template4';
import Template5 from '../Templates/Template5/Template5';
import Template6 from '../Templates/Template6/Template6';
import Template7 from '../Templates/Template7/Template7';
import Template8 from '../Templates/Template8/Template8';
import Template9 from '../Templates/Template9/Template9';
import Template10 from '../Templates/Template10/Template10';
import Template11 from '../Templates/Template11/Template11';
import Template12 from '../Templates/Template12/Template12';
import Template13 from '../Templates/Template13/Template13';
import Template14 from '../Templates/Template14/Template14';
import Template15 from '../Templates/Template15/Template15';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TEMPLATE_MAP = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template4: Template4,
  template5: Template5,
  template6: Template6,
  template7: Template7,
  template8: Template8,
  template9: Template9,
  template10: Template10,
  template11: Template11,
  template12: Template12,
  template13: Template13,
  template14: Template14,
  template15: Template15,
};

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/api/portfolio/public/${slug}`);
        const result = await res.json();

        if (res.ok && result.success && result.data) {
          setPortfolioData(result.data);
        } else {
          setError(result.message || 'Portfolio not found.');
        }
      } catch (err) {
        console.error('Error fetching public portfolio:', err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPublicPortfolio();
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 tracking-wider uppercase text-sm font-semibold mt-6">
          Loading Portfolio...
        </p>
      </div>
    );
  }

  // Error / 404 state
  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6 font-sans">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            🔒
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Portfolio Not Found
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {error || 'This portfolio doesn\'t exist or is set to private. Check the link and try again.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all text-sm uppercase tracking-wider"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Determine which template to render
  const templateId = portfolioData.template_id || portfolioData.templateId || 'template1';
  const TemplateComponent = TEMPLATE_MAP[templateId] || Template1;

  return (
    <div className="relative">
      {/* Render the template with public view props */}
      <TemplateComponent
        publicData={portfolioData}
        isPublicView={true}
      />
    </div>
  );
};

export default PublicPortfolio;
