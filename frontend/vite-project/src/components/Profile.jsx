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
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-8 md:p-16 relative overflow-hidden font-sans">
      {/* Background Gradient Effect */}
      <div className="absolute right-0 top-0 w-1/2 h-1/2 opacity-30 pointer-events-none bg-gradient-to-bl from-teal-500/20 to-transparent blur-[120px]" />
      
      <Navbar />

      <div className="z-10 max-w-xl w-full my-auto mx-auto bg-zinc-950 border border-zinc-900 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Account Profile</h2>
          <Link 
            to="/profile/edit" 
            className="text-xs bg-[#5EEAD4] text-black font-bold uppercase tracking-wider px-4 py-2 rounded hover:bg-[#2DD4BF] transition"
          >
            Edit Profile
          </Link>
        </div>

        {loading && <p className="text-zinc-500 animate-pulse">Loading profile data...</p>}
        {error && <p className="text-red-400 bg-red-950/40 border border-red-900 p-4 rounded text-sm mb-4">{error}</p>}

        {profile && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Full Name</label>
              <p className="text-lg font-medium text-white">{profile.name || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Email Address</label>
              <p className="text-lg font-medium text-zinc-300">{profile.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="z-10 text-xs text-zinc-600 flex justify-between items-center w-full border-t border-zinc-900 pt-4 mt-12">
        <p>© 2026 Portfolio.io. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Profile;