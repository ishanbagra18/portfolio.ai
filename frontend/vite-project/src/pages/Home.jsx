// import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import CallToAction from '../components/CallToAction';
import HowItWorks from '../components/HowItWorks';
import FeatureGrid from '../components/FeatureGrid';


const Home = () => {

  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-8 md:p-16 relative overflow-hidden font-sans">
      
      {/* Background Gradient Effect */}
      <div className="absolute right-0 top-0 w-full md:w-2/3 h-full opacity-40 md:opacity-70 pointer-events-none bg-gradient-to-bl from-teal-500/30 via-emerald-500/10 to-transparent blur-3xl md:blur-[120px]" />

      {/* Integrated Navbar */}
      <Navbar />

      {/* Main Hero Section Content */}
      <div className="z-10 max-w-4xl my-auto pt-12 pb-12">
        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 uppercase select-none">
          Build Portfolios <br />
          That Stand Out <br />
          From The Crowd
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed mb-10 tracking-wide">
          AI-powered layouts. Production-ready designs. <br />
          Deploy your professional portfolio in less than 5 minutes.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <button className="bg-[#5EEAD4] text-black font-semibold px-6 py-3 rounded text-xs md:text-sm tracking-wider uppercase flex items-center gap-2 hover:bg-[#2DD4BF] transition duration-300">
            Create Portfolio 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/viewtemplates')}
           className="border border-zinc-700 bg-transparent text-white font-semibold px-6 py-3 rounded text-xs md:text-sm tracking-wider uppercase hover:bg-zinc-900 transition duration-300">
            Explore Templates
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-xs text-zinc-600 flex justify-between items-center w-full border-t border-zinc-900 pt-4">
        <p>© 2026 Portfolio.io. All rights reserved.</p>
        <p>Crafted for Developers & Designers</p>
      </div>


      <FeatureGrid />
      <HowItWorks />
      <CallToAction />






    </div>
  );
};

export default Home;