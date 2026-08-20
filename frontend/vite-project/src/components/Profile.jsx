import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Could not reach backend API. Please verify configuration.');
        }

        setProfile(response.data.user);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile data.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between p-8 md:p-16 relative overflow-hidden font-sans">
      {/* Background Gradient Effect */}
      <div className="noise-overlay" />
      
      <Navbar />   

      <div className="z-10 max-w-xl w-full my-auto mx-auto bg-[var(--neo-bg)]/50 backdrop-blur-md border border-black/10 dark:border-white/10 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center border-b border-black/10 dark:border-white/10 pb-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Account Profile</h2>
          <Link 
            to="/profile/edit" 
            className="text-xs border border-fuchsia-500/20 bg-fuchsia-600 text-white font-bold uppercase tracking-wider px-4 py-2 rounded hover:bg-fuchsia-500 transition"
          >
            Edit Profile
          </Link>
        </div>

        {loading && <p className="text-zinc-500 animate-pulse">Loading profile data...</p>}
        {error && <p className="text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded text-sm mb-4">{error}</p>}

        {profile && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-[var(--neo-text)] opacity-60 uppercase tracking-wider block mb-1">Full Name</label>
              <p className="text-lg font-medium text-[var(--neo-text)]">{profile.name || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--neo-text)] opacity-60 uppercase tracking-wider block mb-1">Email Address</label>
              <p className="text-lg font-medium text-[var(--neo-text)]">{profile.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="z-10 text-xs text-[var(--neo-text)] opacity-60 flex justify-between items-center w-full border-t border-black/10 dark:border-white/10 pt-4 mt-12">
        <p>© 2026 Portfolio.io. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Profile;