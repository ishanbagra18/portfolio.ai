// Schematic.jsx
// Shared visual language for Template4 — "Blueprint / Schematic" theme.
// A technical-drawing aesthetic: grid paper, corner brackets, monospace annotations.
// Palette lives here so every section stays consistent.

export const theme = {
  navy: '#0B1D33',
  navyDeep: '#081526',
  cyan: '#7EC8E3',
  cyanDim: '#4A7A93',
  orange: '#FF6B35',
  paper: '#E8EEF3',
  muted: '#8FA3B8',
};

// Faint graph-paper grid + a single soft spotlight (no glow blobs).
export const GridBackground = () => (
  <>
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(126,200,227,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126,200,227,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(126,200,227,0.10), transparent 60%)',
      }}
    />
  </>
);

// "Fig. 0X — Section Name" annotation, like a drawing sheet label.
export const SheetLabel = ({ index, title }) => (
  <div className="mb-8 flex items-center gap-3 font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.35em] text-[#7EC8E3]/70">
    <span className="h-1.5 w-1.5 bg-[#FF6B35]" />
    <span>Fig. {index}</span>
    <span className="h-px w-8 bg-[#7EC8E3]/30" />
    <span>{title}</span>
  </div>
);

// Viewfinder-style corner brackets around any block of content.
export const CornerFrame = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    <span className="pointer-events-none absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-[#7EC8E3]/50" />
    <span className="pointer-events-none absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-[#7EC8E3]/50" />
    <span className="pointer-events-none absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-[#7EC8E3]/50" />
    <span className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-[#7EC8E3]/50" />
    {children}
  </div>
);