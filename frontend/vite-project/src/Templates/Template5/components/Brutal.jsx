// Brutal.jsx
// Shared visual language for Template5 — "Scrapbook / Neubrutalism" theme.
// Warm paper background, thick black borders, flat colors, hard offset shadows,
// slightly rotated stickers and stamps instead of blur/glass or grid/schematics.

export const theme = {
  paper: '#F6F1E4',
  ink: '#12110F',
  blue: '#3B5BFF',
  pink: '#FF4D9D',
  green: '#B6F24B',
  yellow: '#FFD23F',
  white: '#FFFFFF',
};

// Cycle of accent colors used to give each section its own sticker color.
export const accents = [theme.blue, theme.pink, theme.green, theme.yellow];

// Subtle halftone dot texture instead of a gradient blur.
export const Dots = ({ className = '' }) => (
  <div
    className={`pointer-events-none absolute inset-0 ${className}`}
    style={{
      backgroundImage: 'radial-gradient(#12110F 1.4px, transparent 1.4px)',
      backgroundSize: '18px 18px',
      opacity: 0.08,
    }}
  />
);

// A torn-paper / zigzag strip used as a section divider.
export const TornDivider = ({ color = '#12110F' }) => (
  <div
    className="h-4 w-full"
    style={{
      backgroundColor: color,
      clipPath:
        'polygon(0% 100%, 4% 0%, 8% 100%, 12% 0%, 16% 100%, 20% 0%, 24% 100%, 28% 0%, 32% 100%, 36% 0%, 40% 100%, 44% 0%, 48% 100%, 52% 0%, 56% 100%, 60% 0%, 64% 100%, 68% 0%, 72% 100%, 76% 0%, 80% 100%, 84% 0%, 88% 100%, 92% 0%, 96% 100%, 100% 0%, 100% 100%)',
    }}
  />
);

// A rotated, bordered sticker-style label.
export const Tag = ({ children, bg = '#FFD23F', rotate = '-rotate-2' }) => (
  <span
    className={`inline-block border-[3px] border-[#12110F] px-3 py-1 font-['Space_Mono'] text-xs uppercase tracking-widest text-[#12110F] ${rotate}`}
    style={{ backgroundColor: bg }}
  >
    {children}
  </span>
);

// A bordered card with a hard offset shadow (no blur) and optional rotation.
export const Card = ({ children, className = '', rotate = '', shadow = '#12110F' }) => (
  <div
    className={`border-[3px] border-[#12110F] bg-[#FFFFFF] ${rotate} ${className}`}
    style={{ boxShadow: `7px 7px 0 ${shadow}` }}
  >
    {children}
  </div>
);