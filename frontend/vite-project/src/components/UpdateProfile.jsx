import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({ error: '', success: '', loading: false, fetching: true });

  // Pre-fill existing user details
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data?.user) {
          setFormData(prev => ({
            ...prev,
            name: response.data.user.name || '',
            email: response.data.user.email || ''
          }));
        }
      } catch (err) {
        setStatus(prev => ({ ...prev, error: 'Could not fetch existing profile data.' }));
      } finally {
        setStatus(prev => ({ ...prev, fetching: false }));
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '', loading: true, fetching: false });

    // Client-side password validation
    if (formData.password && formData.password.length < 6) {
      setStatus({ error: 'Password must be at least 6 characters.', success: '', loading: false, fetching: false });
      return;
    }

    // Build payload containing only populated fields
    const payload = {};
    if (formData.name.trim()) payload.name = formData.name.trim();
    if (formData.email.trim()) payload.email = formData.email.trim();
    if (formData.password) payload.password = formData.password;

    if (Object.keys(payload).length === 0) {
      setStatus({ error: 'Please enter details to update.', success: '', loading: false, fetching: false });
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put('/api/auth/profile', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected non-JSON response from server.');
      }

      setStatus({ error: '', success: response.data.message || 'Profile updated successfully!', loading: false, fetching: false });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile.';
      setStatus({ error: errorMessage, success: '', loading: false, fetching: false });
    }
  };

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between p-8 md:p-16 relative overflow-hidden font-sans">
      {/* Background Gradient Effect */}
      <div className="noise-overlay" />
      
      <Navbar />

      <div className="z-10 max-w-xl w-full my-auto mx-auto bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider border-b border-black/10 dark:border-white/10 pb-4 mb-6">
          Update Profile
        </h2>

        {status.error && <div className="p-3 mb-6 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{status.error}</div>}
        {status.success && <div className="p-3 mb-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">{status.success}</div>}

        {status.fetching ? (
          <p className="text-[var(--neo-text)] opacity-60 animate-pulse">Loading current details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--neo-text)] opacity-60 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 dark:bg-black/20 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--neo-text)] focus:outline-none focus:border-fuchsia-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--neo-text)] opacity-60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 dark:bg-black/20 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--neo-text)] focus:outline-none focus:border-fuchsia-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--neo-text)] opacity-60 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters (Leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 dark:bg-black/20 border border-black/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--neo-text)] focus:outline-none focus:border-fuchsia-500/50 transition"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={status.loading}
                className="flex-1 bg-fuchsia-600 text-white font-bold uppercase tracking-wider text-xs md:text-sm py-3 rounded-xl hover:bg-fuchsia-500 transition disabled:opacity-50 cursor-pointer"
              >
                {status.loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 border border-black/20 dark:border-white/10 text-[var(--neo-text)] opacity-60 font-semibold uppercase tracking-wider text-xs md:text-sm rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:opacity-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="z-10 text-xs text-[var(--neo-text)] opacity-60 flex justify-between items-center w-full border-t border-black/10 dark:border-white/10 pt-4 mt-12">
        <p>© 2026 Portfolio.io. All rights reserved.</p>
      </div>
    </div>
  );
};

export default UpdateProfile;