import React from "react";

const PersonalInfoForm = ({ data = {}, onChange }) => {
  return (
    <section className="py-20 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-end gap-4 mb-16">
        <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-zinc-300 dark:text-zinc-700">
          01
        </span>

        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-zinc-900 dark:text-white">
          Personal Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            value={data.full_name ?? ""}
            onChange={onChange}
            placeholder="e.g. Ishan Bagra"
            className="bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 text-2xl text-[var(--neo-text)] py-3 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">
            Email Address
          </label>

          <input
            type="email"
            name="email_id"
            value={data.email_id ?? ""}
            onChange={onChange}
            placeholder="hello@example.com"
            className="bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 text-2xl text-[var(--neo-text)] py-3 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            required
          />
        </div>

        {/* Age */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">
            Age
          </label>

          <input
            type="number"
            name="age"
            value={data.age ?? ""}
            onChange={onChange}
            placeholder="e.g. 21"
            className="bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 text-2xl text-[var(--neo-text)] py-3 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={data.address ?? ""}
            onChange={onChange}
            placeholder="e.g. Kota, Rajasthan, India"
            className="bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 text-2xl text-[var(--neo-text)] py-3 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        {/* Main Title */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">
            Main Title
          </label>

          <input
            type="text"
            name="main_title"
            value={data.main_title ?? ""}
            onChange={onChange}
            placeholder="e.g. Full-Stack Software Developer"
            className="bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 text-2xl text-[var(--neo-text)] py-3 focus:outline-none focus:border-pink-500 dark:focus:border-white transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            required
          />
        </div>

        {/* Personalized Portfolio Link (Public Slug) */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Personalized Link Handle (Optional)</span>
            <span className="text-xs text-zinc-500 font-mono font-normal">
              {window.location.origin}/p/{data.public_slug || 'custom-link'}
            </span>
          </label>

          <input
            type="text"
            name="public_slug"
            value={data.public_slug ?? ""}
            onChange={onChange}
            placeholder="e.g. ishan-bagra"
            className="bg-transparent border-b-2 border-violet-500/40 text-2xl text-violet-700 dark:text-violet-200 py-3 focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-mono"
          />
        </div>

      </div>
    </section>
  );
};

export default PersonalInfoForm;