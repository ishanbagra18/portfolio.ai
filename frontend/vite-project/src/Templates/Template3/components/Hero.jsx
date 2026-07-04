import React, { useState } from 'react';

const Hero = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const titleParts = (data?.main_title || '').trim().split(' ');
  const firstWord = titleParts[0] || '';
  const restTitle = titleParts.slice(1).join(' ') || '';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data?.email_id || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-slate-50 text-slate-900 flex items-center">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-slate-800">
            01. Profile
          </h2>
          <p className="hidden sm:block text-sm text-slate-500 font-medium">
            Introduction & Overview
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-4 text-base sm:text-lg font-medium text-slate-600">
              👋 Hello, I'm <span className="text-indigo-600 font-bold">{data?.full_name}</span>
            </p>

            <h1 className="text-[clamp(3rem,8vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-slate-900">
              {firstWord}
            </h1>

            {/* Gradient text replacing the stroke effect */}
            <h2 className="text-[clamp(3rem,8vw,6rem)] font-extrabold uppercase leading-[0.9] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 pb-4">
              {restTitle}
            </h2>

            <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
              Passionate about building polished, intuitive, and thoughtful digital experiences that leave a mark.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 sm:flex-row">
              <a
                href={`mailto:${data?.email_id}`}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-300"
              >
                Contact Me
              </a>
              {data?.resume_url && (
                <a
                  href={data.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800"
                >
                  View Resume
                </a>
              )}
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50"
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Decorative background blur behind the card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-100 to-teal-100 opacity-50 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
              <div className="rounded-2xl bg-slate-50 p-8 text-center border border-slate-100">
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-6">
                  Developer Profile
                </span>
                <p className="text-2xl font-bold text-slate-900">
                  {data?.full_name}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500">{data?.main_title}</p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-slate-700 truncate" title={data?.email_id}>
                      {data?.email_id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Focus</p>
                    <p className="text-sm font-medium text-slate-700">Full-Stack</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {copied ? '✓ Copied to clipboard' : 'Copy Email Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;