import { GridBackground } from './Schematic';

const Footer = ({ data }) => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#081526] px-4 sm:px-6 lg:px-10 py-14 border-t border-[#7EC8E3]/10">
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-[0.35em] text-[#7EC8E3]/60">
          End of sheet
        </p>
        <h3 className="mt-3 font-['IBM_Plex_Mono'] text-2xl sm:text-3xl font-bold text-[#E8EEF3]">
          Thanks for reviewing.
        </h3>
        <p className="mt-4 font-['IBM_Plex_Sans'] text-sm text-[#8FA3B8]">
          © {new Date().getFullYear()} {data.full_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;