import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/Button';
import { User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  const blur = useTransform(scrollY, [0, 100], ['blur(8px)', 'blur(16px)']);
  const bgOpacity = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.15)']);

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
    <motion.nav
      style={{ backdropFilter: blur, backgroundColor: bgOpacity }}
      className="sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4 border-b border-black/20 dark:border-white/20 mb-8 transition-colors"
    >
      <div className="flex items-center gap-8">
        <Link
          to="/home"
          className="text-2xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-pink-400 hover:opacity-80 transition duration-300"
        >
          PORTFOLIO.AI
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/my-portfolios" className="text-sm font-semibold font-sans text-[var(--neo-text)] hover:text-accent-color transition duration-200">
            My Portfolios
          </Link>
          <Link to="/career-tools" className="text-sm font-semibold font-sans text-[var(--neo-text)] hover:text-accent-color transition duration-200">
            Career Tools
          </Link>
          <Link to="/cold-email-generator" className="text-sm font-semibold font-sans text-[var(--neo-text)] hover:text-accent-color transition duration-200">
            Cold Email
          </Link>
          <Link to="/ats-checker" className="text-sm font-semibold font-sans text-[var(--neo-text)] hover:text-accent-color transition duration-200">
            ATS Checker
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Theme Toggle Button */}
        <Button
          variant="glass"
          onClick={toggleTheme}
          className="inline-flex items-center justify-center p-2.5 rounded-full transition-all active:scale-95 text-[var(--neo-text)] hover:text-fuchsia-400"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* My Profile Button */}
        <Button
          variant="glass"
          onClick={() => navigate('/profile')}
          className="hidden md:inline-flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95"
        >
          <User className="w-4 h-4 opacity-70" />
          My Profile
        </Button>

        {/* Edit Profile Button */}
        <Button
          variant="neo"
          onClick={() => navigate('/profile/edit')}
          className="inline-flex items-center gap-2 px-3 cursor-pointer sm:px-4 py-2.5 text-sm font-medium transition-all active:scale-95"
        >
          <Settings className="w-4 h-4 opacity-70" />
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </Button>

        {/* Logout Button */}
        <Button
          variant="neo"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 cursor-pointer text-sm font-medium text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:ring-2 focus:ring-red-500/50 transition-all active:scale-95 dark:text-red-500 dark:hover:bg-red-950/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;