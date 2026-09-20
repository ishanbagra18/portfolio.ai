import React, { Suspense, lazy } from 'react';
import { LoadingFallback } from './ui/LoadingFallback';

// Map of all 20 template components
const TEMPLATE_COMPONENTS = {
  template1: lazy(() => import('../Templates/Template1/Template1')),
  template2: lazy(() => import('../Templates/Template2/Template2')),
  template3: lazy(() => import('../Templates/Template3/Template3')),
  template4: lazy(() => import('../Templates/Template4/Template4')),
  template5: lazy(() => import('../Templates/Template5/Template5')),
  template6: lazy(() => import('../Templates/Template6/Template6')),
  template7: lazy(() => import('../Templates/Template7/Template7')),
  template8: lazy(() => import('../Templates/Template8/Template8')),
  template9: lazy(() => import('../Templates/Template9/Template9')),
  template10: lazy(() => import('../Templates/Template10/Template10')),
  template11: lazy(() => import('../Templates/Template11/Template11')),
  template12: lazy(() => import('../Templates/Template12/Template12')),
  template13: lazy(() => import('../Templates/Template13/Template13')),
  template14: lazy(() => import('../Templates/Template14/Template14')),
  template15: lazy(() => import('../Templates/Template15/Template15')),
  template16: lazy(() => import('../Templates/Template16/Template16')),
  template17: lazy(() => import('../Templates/Template17/Template17')),
  template18: lazy(() => import('../Templates/Template18/Template18')),
  template19: lazy(() => import('../Templates/Template19/Template19')),
  template20: lazy(() => import('../Templates/Template20/Template20'))
};

export default function LiveTemplatePreview({ templateId = 'template1', formData }) {
  const NormalizedId = (templateId || 'template1').toLowerCase();
  const SelectedTemplate = TEMPLATE_COMPONENTS[NormalizedId] || TEMPLATE_COMPONENTS.template1;

  // Apply Theme Customizer overrides dynamically via CSS variables
  const theme = formData?.personalInfo?.theme_settings || {};
  const primaryColor = theme.primaryColor || '#ec4899';
  const fontFamily = theme.fontFamily || 'sans';
  const borderRadius = theme.borderRadius || 'rounded';

  const fontStyleCss = {
    sans: "'Inter', sans-serif",
    display: "'Space Grotesk', sans-serif",
    serif: "'Playfair Display', serif",
    mono: "'JetBrains Mono', monospace"
  }[fontFamily] || "'Inter', sans-serif";

  const borderRadiusCss = {
    sharp: '0px',
    rounded: '1rem',
    pill: '2rem'
  }[borderRadius] || '1rem';

  const customStyle = {
    '--accent-color': primaryColor,
    '--primary-color': primaryColor,
    '--neo-accent': primaryColor,
    '--theme-accent': primaryColor,
    '--border-radius': borderRadiusCss,
    fontFamily: fontStyleCss
  };

  return (
    <div style={customStyle} className="theme-customizer-scope w-full h-full overflow-y-auto rounded-2xl border border-white/10 shadow-2xl relative bg-zinc-950">
      <style>{`
        .theme-customizer-scope {
          --accent-color: ${primaryColor} !important;
          --primary-color: ${primaryColor} !important;
          --neo-accent: ${primaryColor} !important;
          --theme-accent: ${primaryColor} !important;
        }
        .theme-customizer-scope button,
        .theme-customizer-scope .bg-pink-500,
        .theme-customizer-scope .bg-violet-500,
        .theme-customizer-scope .bg-teal-500,
        .theme-customizer-scope .bg-cyan-500,
        .theme-customizer-scope .bg-emerald-500,
        .theme-customizer-scope .bg-[#FF6B35] {
          --accent-color: ${primaryColor} !important;
        }
        .theme-customizer-scope .text-pink-500,
        .theme-customizer-scope .text-violet-500,
        .theme-customizer-scope .text-teal-500,
        .theme-customizer-scope .text-cyan-500,
        .theme-customizer-scope .text-emerald-500,
        .theme-customizer-scope .text-[#FF6B35] {
          color: ${primaryColor} !important;
        }
        .theme-customizer-scope .border-pink-500,
        .theme-customizer-scope .border-violet-500,
        .theme-customizer-scope .border-teal-500,
        .theme-customizer-scope .border-cyan-500,
        .theme-customizer-scope .border-emerald-500 {
          border-color: ${primaryColor} !important;
        }
      `}</style>
      <Suspense fallback={<LoadingFallback />}>
        <SelectedTemplate
          key={`${NormalizedId}-${JSON.stringify(theme)}-${JSON.stringify(formData?.personalInfo?.section_order || [])}-${JSON.stringify(formData?.personalInfo?.section_visibility || {})}`}
          publicData={formData}
          isPublicView={true}
        />
      </Suspense>
    </div>
  );
}
