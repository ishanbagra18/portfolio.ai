import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Sun, Moon, Menu, X, LayoutDashboard, Briefcase, FileCheck, Layers, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { isAuthenticated } from '../lib/auth';
import { Button } from './ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav
      className={`sticky top-0 z-50 w-full px-4 sm:px-6 transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 border-b mb-6 ${
        isScrolled
          ? 'py-3 bg-white/95 dark:bg-zinc-950/85 border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-2xl'
          : 'py-4 bg-white/70 dark:bg-zinc-950/60 border-zinc-200/60 dark:border-white/5'
      }`}
    >
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-6 xl:gap-8">
          <Link
            to={loggedIn ? "/home" : "/"}
            className="text-xl sm:text-2xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 hover:opacity-80 transition duration-300"
          >
            PORTFOLIO.AI
          </Link>

          {loggedIn && (
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-assist-id={link.path === '/my-portfolios' ? 'nav-my-portfolios' : link.path === '/viewtemplates' ? 'nav-templates' : undefined}
                  className={`text-sm font-semibold font-sans transition duration-200 ${
                    location.pathname === link.path
                      ? 'text-pink-600 dark:text-pink-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-pink-500 dark:hover:text-pink-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right side Desktop Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            data-assist-id="theme-toggle"
            className="inline-flex items-center justify-center p-2.5 rounded-full transition-all active:scale-95 text-zinc-600 dark:text-zinc-200 hover:text-pink-500 dark:hover:text-pink-400 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {loggedIn ? (
            <>
              {/* My Profile Button */}
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center cursor-pointer gap-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95 rounded-full text-zinc-700 dark:text-white bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none"
              >
                <User className="w-4 h-4 opacity-70" />
                My Profile
              </button>

              {/* Edit Profile Button */}
              <button
                onClick={() => navigate('/profile/edit')}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium transition-all active:scale-95 rounded-full text-zinc-700 dark:text-white bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none cursor-pointer"
              >
                <Settings className="w-4 h-4 opacity-70" />
                <span>Edit Profile</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 shadow-sm dark:shadow-none transition-all active:scale-95 rounded-full cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Guest Log in Button */}
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 rounded-full text-sm font-semibold text-zinc-600 dark:text-white/80 hover:text-pink-600 dark:hover:text-white transition cursor-pointer"
              >
                Log in
              </button>

              {/* Guest Get Started Button */}
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile / Tablet Control Group */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <Button
            variant="glass"
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-700 dark:text-zinc-200 bg-white dark:bg-transparent border border-zinc-200 dark:border-transparent shadow-sm dark:shadow-none"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </Button>

          {/* Mobile Menu Hamburger Toggle */}
          <Button
            variant="neo"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-zinc-800 dark:text-zinc-200 bg-white dark:bg-transparent border border-zinc-200 dark:border-transparent shadow-sm dark:shadow-none"
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
            className="md:hidden overflow-hidden mt-4 pt-4 border-t border-zinc-200 dark:border-white/10 flex flex-col gap-2"
          >
            {loggedIn ? (
              <>
                {navLinks.map((link) => {
                  const IconComp = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'bg-pink-50 dark:bg-gradient-to-r dark:from-violet-600/20 dark:to-pink-600/20 text-pink-600 dark:text-pink-400 font-bold border border-pink-200 dark:border-pink-500/20 shadow-sm dark:shadow-none'
                          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10'
                      }`}
                    >
                      <IconComp className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-white/10 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/10 text-left"
                  >
                    <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white hover:bg-zinc-200 font-bold text-sm transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-pink-500/20"
                >
                  Get started
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;