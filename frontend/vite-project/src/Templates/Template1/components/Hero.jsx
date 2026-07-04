import React from 'react';

const Hero = ({ data }) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Background Gradients & Textures */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_30%),radial-gradient(circle_at_left,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_right,_rgba(236,72,153,0.12),_transparent_26%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Decorative Blurs */}
      <div className="absolute -top-20 left-[-5rem] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute top-28 right-[-6rem] h-96 w-96 rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-violet-500/20 blur-[150px]" />

      <div className="relative z-10 grid w-full max-w-7xl items-center gap-10 lg:grid-cols-12">
        {/* Left */}
        <div className="lg:col-span-4">
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.08)]">
              Welcome to
              <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                {data?.full_name || "Welcome User"}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base sm:text-lg leading-7 text-white/70">
              {data?.main_title || "Full Stack Developer"}
            </p>

            {data?.resume_url && (
              <a
                href={data.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90"
              >
                View Resume
              </a>
            )}
          </div>
        </div>

        {/* Center - Upgraded CSS Floating Orb */}
        <div className="relative flex justify-center lg:col-span-4">
          {/* Ambient Background Glow */}
          <div className="absolute h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/20 blur-[130px] animate-pulse" />

          {/* 3D Scene Container */}
          <div className="relative flex h-[30rem] w-[30rem] items-center justify-center">
            
            {/* Orbiting Rings */}
            <div className="absolute h-[22rem] w-[22rem] animate-[spin_12s_linear_infinite] rounded-full border border-fuchsia-500/30 border-dashed" />
            <div className="absolute h-[26rem] w-[26rem] animate-[spin_18s_linear_infinite_reverse] rounded-full border border-cyan-500/30 border-dashed" />

            {/* Main Floating Glass Sphere */}
            <div className="relative z-10 flex h-64 w-64 animate-[bounce_4s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.6),_inset_0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
              
              {/* Fake 3D Light Reflection (Curvature) */}
              <div className="absolute top-6 left-8 h-20 w-20 rounded-full bg-white/30 blur-2xl" />
              <div className="absolute bottom-6 right-8 h-16 w-16 rounded-full bg-cyan-400/20 blur-xl" />

              {/* Inner Energy Core */}
              <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-cyan-300 shadow-[0_0_60px_rgba(168,85,247,0.8)]">
                {/* Core highlight */}
                <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.8),_transparent_60%)]" />
              </div>
            </div>

          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-4 lg:pl-8">
          <div className="max-w-md">
            <p className="mb-5 text-4xl sm:text-5xl font-extrabold text-white">
              Available for job opportunities worldwide.
            </p>

            <p className="text-base sm:text-lg leading-7 text-white/70">
              Driven to craft seamless, user-centric digital experiences that blend functionality with elegance and purpose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;