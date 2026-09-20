import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProGate from '../components/ProGate';
import { Download, Mail, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function RecruiterLeads() {
  const leads = [
    { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@stripe.com', company: 'Stripe', msg: 'Interested in your AI engineering portfolio for a Staff Frontend role.', date: '2 hours ago' },
    { id: '2', name: 'Alex Rivera', email: 'arivera@openai.com', company: 'OpenAI', msg: 'Great work on LLM pipelines. Would love to connect!', date: '18 hours ago' },
    { id: '3', name: 'David Kim', email: 'dkim@vercel.com', company: 'Vercel', msg: 'Impressed by your custom React animations.', date: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-aurora text-[var(--neo-text)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 w-full flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight mb-1">Recruiter Lead Capture</h1>
            <p className="text-sm opacity-70">Recruiters who left contact information inside your AI chatbot.</p>
          </div>
          <Button variant="neo" className="text-xs font-bold px-4 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <ProGate feature="chatbot_leads" title="Recruiter Leads Locked">
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/90">
                <thead className="bg-white/5 text-xs font-mono text-white/50 uppercase border-b border-white/10">
                  <tr>
                    <th className="p-4">Recruiter</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Captured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold flex items-center gap-2">
                          <User className="w-4 h-4 text-pink-400" />
                          {lead.name}
                        </div>
                        <div className="text-xs text-white/50">{lead.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold flex items-center gap-1.5 w-fit">
                          <Building2 className="w-3.5 h-3.5 text-purple-400" />
                          {lead.company}
                        </span>
                      </td>
                      <td className="p-4 text-xs opacity-80 max-w-md">{lead.msg}</td>
                      <td className="p-4 font-mono text-xs text-white/50">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ProGate>
      </main>

      <Footer />
    </div>
  );
}
