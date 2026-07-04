// Editorial.jsx
// Shared visual language for Template6 — "Editorial / Gallery Plate" theme.
// Ivory paper, deep emerald + brass accents, serif display type, hairline rules.
// No cards, no borders-as-boxes, no shadows or blur — structure comes from
// typography, whitespace, and thin dividing lines, like a museum catalogue.

export const theme = {
  ivory: '#F7F4EE',
  ink: '#1B1B1B',
  emerald: '#1F4D3A',
  gold: '#B8935F',
  muted: '#6B6B63',
};

// "Plate No. 0X — Section Name", like a museum wall label / catalogue entry.
export const PlateLabel = ({ number, title }) => (
  <div className="mb-10 flex items-center gap-4">
    <span className="font-['Fraunces'] italic text-sm text-[#B8935F]">
      Plate No. {number}
    </span>
    <span className="h-px w-16 sm:w-20 bg-[#B8935F]/40" />
    <span className="font-['Inter'] text-[11px] uppercase tracking-[0.3em] text-[#6B6B63]">
      {title}
    </span>
  </div>
);

// Oversized, faint numeral used as a background watermark for each section.
export const Watermark = ({ text }) => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -top-10 right-0 select-none font-['Fraunces'] text-[200px] sm:text-[280px] leading-none text-[#1B1B1B]/[0.035]"
  >
    {text}
  </span>
);

export const Hairline = ({ className = '' }) => (
  <div className={`h-px w-full bg-[#1B1B1B]/10 ${className}`} />
);

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();