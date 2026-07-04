const Footer = ({ data }) => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#1F4D3A] px-6 sm:px-10 lg:px-16 py-16">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="font-['Fraunces'] italic text-2xl sm:text-3xl text-[#F7F4EE]">
          Fin.
        </p>
        <p className="mt-4 font-['Inter'] text-xs uppercase tracking-[0.3em] text-[#F7F4EE]/60">
          © {new Date().getFullYear()} {data.full_name} — All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;