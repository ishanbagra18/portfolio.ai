// import React from 'react';

const Hero = ({ data }) => {
  const titleParts = data.main_title.split(' ');
  const firstWord = titleParts[0] || '';
  const restTitle = titleParts.slice(1).join(' ') || '';

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_26%),radial-gradient(circle_at_left,_rgba(59,130,246,0.10),_transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Top line */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-md">
          Portfolio / 2026
        </div>
        <div className="hidden sm:block text-sm text-white/40">
          {data.full_name}
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center justify-center px-4 pb-16 sm:px-6 lg:px-8">
        <p className="mb-6 max-w-3xl text-center text-sm sm:text-base md:text-lg tracking-wide text-white/60">
          👋, my name is <span className="text-white font-semibold">{data.full_name}</span> and I am a
        </p>

        <div className="relative w-full">
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

          <h1 className="relative text-center text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] text-white">
            {firstWord}
          </h1>

          <h2
            className="relative mt-2 text-center text-[clamp(3rem,11vw,9rem)] font-black uppercase leading-[0.88] tracking-[-0.08em]"
            style={{
              WebkitTextStroke: '1.5px rgba(255,255,255,0.95)',
              color: 'transparent',
            }}
          >
            {restTitle}
          </h2>
        </div>

        <p className="mt-10 max-w-3xl text-center text-base sm:text-lg md:text-xl leading-8 text-white/70">
          Passionate about building polished, intuitive, and thoughtful digital experiences that leave a mark.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={`mailto:${data.email_id}`}
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90"
          >
            Contact Me
          </a>
          {data?.resume_url && (
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              Resume
            </a>
          )}
        </div>
      </div>

      {/* Bottom subtle line */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
};

export default Hero;