import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { User, Settings, LogOut, Sun, Moon, Menu, X, LayoutDashboard, Briefcase, Mail, FileCheck, Layers } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { path: '/viewtemplates', label: 'Templates', icon: Layers },
    { path: '/my-portfolios', label: 'My Portfolios', icon: LayoutDashboard },
    { path: '/career-tools', label: 'Career Tools', icon: Briefcase },
    { path: '/ats-checker', label: 'ATS Checker', icon: FileCheck },
  ];

  return (
    <motion.nav
      style={{ backdropFilter: blur, backgroundColor: bgOpacity }}
      className="sticky top-0 z-50 w-full px-4 sm:px-6 py-4 border-b border-black/20 dark:border-white/20 mb-8 transition-colors"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-6 xl:gap-8">
          <Link
            to="/home"
            className="text-xl sm:text-2xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-pink-400 hover:opacity-80 transition duration-300"
          >
            PORTFOLIO.AI
          </Link>
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold font-sans transition duration-200 ${
                  location.pathname === link.path
                    ? 'text-pink-400 font-bold'
                    : 'text-[var(--neo-text)] hover:text-accent-color'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
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
            className="inline-flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95"
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
            <span>Edit Profile</span>
          </Button>

          {/* Logout Button */}
          <Button
            variant="neo"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 cursor-pointer text-sm font-medium text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:ring-2 focus:ring-red-500/50 transition-all active:scale-95 dark:text-red-500 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Mobile / Tablet Control Group */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <Button
            variant="glass"
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--neo-text)]"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Mobile Menu Hamburger Toggle */}
          <Button
            variant="neo"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-[var(--neo-text)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-pink-400 font-bold border border-pink-500/20'
                      : 'text-[var(--neo-text)] hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-pink-400" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--neo-text)] hover:bg-white/10 text-left"
              >
                <User className="w-4 h-4 text-indigo-400" />
                My Profile
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profile/edit');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--neo-text)] hover:bg-white/10 text-left"
              >
                <Settings className="w-4 h-4 text-violet-400" />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;