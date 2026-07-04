
const Footer = ({ data }) => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#11051d] px-4 sm:px-6 lg:px-8 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_30%),radial-gradient(circle_at_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#1a082c_0%,_#11051d_55%,_#0a0312_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="absolute -top-10 left-[-4rem] h-56 w-56 rounded-full bg-fuchsia-500/20 blur-[110px]" />
      <div className="absolute bottom-[-4rem] right-[-3rem] h-56 w-56 rounded-full bg-cyan-500/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/8 px-6 py-10 text-center backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 mb-3">
            Thank You!
          </h3>

          <p className="text-base sm:text-lg text-white/70">
            Thanks for visiting my portfolio.
          </p>

          <p className="mt-4 text-sm text-white/45">
            © {new Date().getFullYear()} {data.full_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;