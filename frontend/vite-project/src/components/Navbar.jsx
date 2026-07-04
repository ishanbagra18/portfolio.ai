// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err.response?.data?.message || err.message);
    } finally {
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
  };

  return (
    <nav className="z-10 flex justify-between items-center w-full py-5 border-b border-zinc-800/80 mb-8 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link 
          to="/home" 
          className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 hover:opacity-80 transition duration-300"
        >
          PORTFOLIO.AI
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/my-portfolios" className="text-sm font-semibold text-zinc-400 hover:text-white transition duration-200">
            My Portfolios
          </Link>
          <Link to="/ats-checker" className="text-sm font-semibold text-zinc-400 hover:text-white transition duration-200">
            ATS Checker
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        {/* My Profile - Clean Ghost/Border Styled Button */}
        <Link 
          to="/profile" 
          className="text-xs md:text-sm font-medium text-zinc-300 bg-zinc-900/80 border border-zinc-700/60 px-5 py-2.5 rounded-full hover:bg-zinc-800 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.07)] active:scale-95 transition-all duration-300"
        >
          My Profile
        </Link>

        {/* Change Profile - Highlighted Gradient Border/Solid Action Button */}
        <Link 
          to="/profile/edit" 
          className="text-xs md:text-sm font-semibold text-black bg-white border border-white px-5 py-2.5 rounded-full hover:bg-zinc-200 hover:border-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 transition-all duration-300"
        >
          Change Profile
        </Link>

        {/* Logout - Sleek Neon Red Glow on Hover */}
        <button 
          onClick={handleLogout}
          className="text-xs md:text-sm font-medium text-red-400 bg-red-950/30 border border-red-800/50 px-5 py-2.5 rounded-full hover:bg-red-900/50 hover:text-red-200 hover:border-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] active:scale-95 transition-all duration-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;