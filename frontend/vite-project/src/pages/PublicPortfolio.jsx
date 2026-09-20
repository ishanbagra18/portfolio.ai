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
import Template16 from '../Templates/Template16/Template16';
import Template17 from '../Templates/Template17/Template17';
import Template18 from '../Templates/Template18/Template18';
import Template19 from '../Templates/Template19/Template19';
import Template20 from '../Templates/Template20/Template20';
import { API_BASE } from '../lib/api';
import { Lock, Clock, Key, ArrowRight } from 'lucide-react';
import PortfolioBadge from '../components/PortfolioBadge';
import RecruiterChangelog from '../components/RecruiterChangelog';
import ShareModal from '../components/ShareModal';

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
  template16: Template16,
  template17: Template17,
  template18: Template18,
  template19: Template19,
  template20: Template20,
};

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(null);
  const [verifyingPasscode, setVerifyingPasscode] = useState(false);

  // Dynamic SEO & Open Graph Tags Injection
  const updateMetaTags = (data) => {
    if (!data?.personalInfo) return;
    const name = data.personalInfo.full_name || 'Developer';
    const title = data.personalInfo.main_title || 'Software Engineer';
    const about = data.personalInfo.about_paragraph || `View ${name}'s official portfolio on Portfolio.AI`;

    // Page Title
    document.title = `${name} | ${title} - Portfolio.AI`;

    // Helper to update meta tag
    const setMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogImageUrl = `${API_BASE}/api/portfolio/og/${slug || data.personalInfo.id || 'default'}`;

    setMeta('name', 'description', about);
    setMeta('property', 'og:title', `${name} - ${title}`);
    setMeta('property', 'og:description', about);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Portfolio.AI');
    setMeta('property', 'og:image', ogImageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', `${name} - ${title}`);
    setMeta('name', 'twitter:description', about);
    setMeta('name', 'twitter:image', ogImageUrl);

  };

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsProtected(false);
        setIsExpired(false);

        const res = await fetch(`${API_BASE}/api/portfolio/public/${slug}`);
        const result = await res.json();

        if (res.status === 410 || result.isExpired) {
          setIsExpired(true);
          return;
        }

        if (result.isProtected) {
          setIsProtected(true);
          return;
        }

        if (res.ok && result.success && result.data) {
          setPortfolioData(result.data);
          updateMetaTags(result.data);
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

  const handleVerifyPasscode = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setVerifyingPasscode(true);
    setPasscodeError(null);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/public/${slug}/verify-passcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });
      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setPortfolioData(result.data);
        setIsProtected(false);
        updateMetaTags(result.data);
      } else {
        setPasscodeError(result.message || 'Incorrect passcode.');
      }
    } catch (err) {
      setPasscodeError('Connection error while verifying passcode.');
    } finally {
      setVerifyingPasscode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 tracking-wider uppercase text-xs font-semibold mt-6">
          Loading Portfolio...
        </p>
      </div>
    );
  }

  // Link Expired Screen
  if (isExpired) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-400">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold uppercase mb-2">Private Link Expired</h1>
          <p className="text-zinc-400 text-sm mb-6">
            This private recruiter link has reached its expiration time and is no longer accessible. Please contact the candidate for an updated link.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-zinc-200 transition">
            Go to Portfolio.AI
          </a>
        </div>
      </div>
    );
  }

  // Password Protection Prompt Dialog
  if (isProtected) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold uppercase mb-2">Protected Portfolio</h1>
          <p className="text-zinc-400 text-xs mb-6">
            This portfolio is passcode protected for specific recruiters. Enter the passcode provided to view this profile.
          </p>
          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
              <input
                type="password"
                placeholder="Enter Recruiter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
            {passcodeError && <p className="text-red-400 text-xs font-semibold">⚠ {passcodeError}</p>}
            <button
              type="submit"
              disabled={verifyingPasscode || !passcode.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
            >
              {verifyingPasscode ? 'Verifying...' : 'Unlock Portfolio'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white px-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-black mb-3">Portfolio Not Found</h1>
          <p className="text-zinc-400 text-sm mb-8">
            {error || 'This portfolio doesn\'t exist or is set to private.'}
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase tracking-wider">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const templateId = portfolioData.template_id || portfolioData.templateId || 'template1';
  const TemplateComponent = TEMPLATE_MAP[templateId] || Template1;

  // Custom Theme Settings Overrides
  const theme = portfolioData?.personalInfo?.theme_settings || {};
  const primaryColor = theme.primaryColor || '#ec4899';
  const fontFamily = theme.fontFamily || 'sans';

  const fontStyleCss = {
    sans: "'Inter', sans-serif",
    display: "'Space Grotesk', sans-serif",
    serif: "'Playfair Display', serif",
    mono: "'JetBrains Mono', monospace"
  }[fontFamily] || "'Inter', sans-serif";

  const customStyle = {
    '--accent-color': primaryColor,
    fontFamily: fontStyleCss
  };

  return (
    <div style={customStyle} className="public-portfolio-scope relative min-h-screen">
      <style>{`
        .public-portfolio-scope,
        .public-portfolio-scope *,
        .public-portfolio-scope h1,
        .public-portfolio-scope h2,
        .public-portfolio-scope h3,
        .public-portfolio-scope h4,
        .public-portfolio-scope p,
        .public-portfolio-scope span,
        .public-portfolio-scope a,
        .public-portfolio-scope button {
          font-family: ${fontStyleCss} !important;
        }
        .public-portfolio-scope {
          --accent-color: ${primaryColor} !important;
          --primary-color: ${primaryColor} !important;
          --neo-accent: ${primaryColor} !important;
          --theme-accent: ${primaryColor} !important;
        }
      `}</style>

      {/* Floating Top Control Bar for Visitors & Recruiters */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 pointer-events-auto">
        <ShareModal
          candidateName={portfolioData?.personalInfo?.full_name || 'Candidate'}
        />
        <RecruiterChangelog
          candidateName={portfolioData?.personalInfo?.full_name || 'Candidate'}
          editable={false}
        />
      </div>

      <TemplateComponent publicData={portfolioData} isPublicView={true} />
      <PortfolioBadge />
    </div>
  );

};

export default PublicPortfolio;
