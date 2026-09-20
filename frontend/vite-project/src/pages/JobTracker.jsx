import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProGate from '../components/ProGate';
import { Briefcase, Plus, DollarSign, Building, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function JobTracker() {
  const columns = [
    { id: 'wishlist', title: 'Wishlist', color: 'border-blue-500/40' },
    { id: 'applied', title: 'Applied', color: 'border-yellow-500/40' },
    { id: 'interviewing', title: 'Interviewing', color: 'border-purple-500/40' },
    { id: 'offer', title: 'Offer Received', color: 'border-emerald-500/40' }
  ];

  const apps = [
    { id: '1', company: 'Stripe', role: 'Staff Frontend Engineer', status: 'interviewing', salary: '$185,000' },
    { id: '2', company: 'OpenAI', role: 'Full Stack Engineer', status: 'applied', salary: '$190,000' },
    { id: '3', company: 'Vercel', role: 'DevEx Engineer', status: 'offer', salary: '$175,000' },
    { id: '4', company: 'Linear', role: 'Product Engineer', status: 'wishlist', salary: '$180,000' }
  ];

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight mb-1">Job Application Tracker</h1>
            <p className="text-sm opacity-70">Kanban board to track tech job applications, interviews, and offers.</p>
          </div>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-4 py-2 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Application
          </Button>
        </div>

        <ProGate feature="job_tracker" title="Job Tracker Locked">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map(col => (
              <div key={col.id} className={`bg-white/5 border ${col.color} rounded-3xl p-4 backdrop-blur-xl flex flex-col gap-4 min-h-[400px]`}>
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{col.title}</h3>
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white/70 text-xs flex items-center justify-center font-mono">
                    {apps.filter(a => a.status === col.id).length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {apps.filter(a => a.status === col.id).map(app => (
                    <div key={app.id} className="bg-black/40 border border-white/10 p-4 rounded-2xl hover:border-pink-500/40 transition-all cursor-pointer">
                      <div className="font-bold text-sm text-white mb-1">{app.role}</div>
                      <div className="text-xs text-pink-400 font-medium flex items-center gap-1 mb-3">
                        <Building className="w-3 h-3" /> {app.company}
                      </div>
                      <div className="text-[11px] font-mono text-white/50 flex justify-between">
                        <span>{app.salary}</span>
                        <span className="text-emerald-400 font-bold">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ProGate>
      </main>

      <Footer />
    </div>
  );
}
