import { Dots, TornDivider } from './Brutal';

const Footer = ({ data }) => {
  return (
    <footer className="relative w-full overflow-hidden bg-[#12110F] px-4 sm:px-6 lg:px-10 py-16">
      <TornDivider color="#F6F1E4" />
      <Dots className="opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-7xl pt-10 text-center">
        <h3 className="font-['Archivo_Black'] text-2xl sm:text-3xl text-[#F6F1E4]">
          Thanks for scrolling!
        </h3>
        <p className="mt-3 font-['Inter'] text-sm text-[#F6F1E4]/60">
          © {new Date().getFullYear()} {data.full_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;