import React from 'react';
import { Palette, Type, Maximize2, Circle } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Neon Pink', hex: '#ec4899' },
  { name: 'Violet Glow', hex: '#8b5cf6' },
  { name: 'Emerald Cyber', hex: '#10b981' },
  { name: 'Cyan Matrix', hex: '#06b6d4' },
  { name: 'Gold Velvet', hex: '#eab308' },
  { name: 'Electric Blue', hex: '#3b82f6' }
];

const FONTS = [
  { id: 'sans', name: 'Modern Sans (Inter)', css: "'Inter', sans-serif" },
  { id: 'display', name: 'Display Heavy (Space Grotesk)', css: "'Space Grotesk', sans-serif" },
  { id: 'serif', name: 'Luxury Serif (Playfair)', css: "'Playfair Display', serif" },
  { id: 'mono', name: 'Technical Monospace (JetBrains)', css: "'JetBrains Mono', monospace" }
];

const SPACING_SCALES = [
  { id: 'compact', name: 'Compact', class: 'gap-4 p-4' },
  { id: 'normal', name: 'Balanced (Default)', class: 'gap-8 p-8' },
  { id: 'spacious', name: 'Airy & Spacious', class: 'gap-12 p-12' }
];

const BORDER_RADIUS = [
  { id: 'sharp', name: 'Sharp Angle', class: 'rounded-none' },
  { id: 'rounded', name: 'Rounded (Default)', class: 'rounded-2xl' },
  { id: 'pill', name: 'Soft Pill', class: 'rounded-3xl' }
];

export default function ThemeCustomizerPanel({ themeSettings = {}, onChange }) {
  const currentSettings = {
    primaryColor: themeSettings.primaryColor || '#ec4899',
    bgMode: themeSettings.bgMode || 'dark',
    fontFamily: themeSettings.fontFamily || 'sans',
    spacingScale: themeSettings.spacingScale || 'normal',
    borderRadius: themeSettings.borderRadius || 'rounded'
  };

  const updateField = (key, val) => {
    onChange({ ...currentSettings, [key]: val });
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl mb-8 font-sans">
      <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-white/10">
        <Palette className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-[var(--neo-text)]">Theme Customizer</h3>
        <span className="ml-auto text-xs text-[var(--neo-text)]/60 font-mono">
          Overrides all 20 Templates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accent Color Palette */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--neo-text)]/70 mb-3 flex items-center gap-2">
            <Circle className="w-3.5 h-3.5 text-pink-400" /> Accent Color
          </label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {PRESET_COLORS.map(c => (
              <button
                key={c.hex}
                type="button"
                onClick={() => updateField('primaryColor', c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  currentSettings.primaryColor === c.hex ? 'border-white scale-110 ring-2 ring-white/30' : 'border-transparent'
                }`}
                title={c.name}
              />
            ))}
            <input
              type="color"
              value={currentSettings.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none"
              title="Custom Color Picker"
            />
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--neo-text)]/70 mb-3 flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-indigo-400" /> Font Style
          </label>
          <select
            value={currentSettings.fontFamily}
            onChange={(e) => updateField('fontFamily', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--neo-text)] focus:outline-none focus:border-indigo-400 transition"
          >
            {FONTS.map(f => (
              <option key={f.id} value={f.id} className="bg-zinc-900 text-white">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Spacing Scale */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--neo-text)]/70 mb-3 flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Layout Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SPACING_SCALES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => updateField('spacingScale', s.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                  currentSettings.spacingScale === s.id
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-[var(--neo-text)]/70 hover:bg-white/10'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--neo-text)]/70 mb-3 flex items-center gap-2">
            Border Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BORDER_RADIUS.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => updateField('borderRadius', r.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                  currentSettings.borderRadius === r.id
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                    : 'bg-white/5 border-white/10 text-[var(--neo-text)]/70 hover:bg-white/10'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
