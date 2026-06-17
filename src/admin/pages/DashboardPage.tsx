import { useEffect, useState, ReactNode } from 'react';
import { Car, FileText, MessageSquare, Mail, Loader2, Terminal } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Consultation {
  id: string;
  name: string;
  email: string;
  package_type: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<{ label: string; count: number; icon: ReactNode; color: string }[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultationsLoading, setConsultationsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [v, b, c, m] = await Promise.all([
          supabase.from('vehicles').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('consultations').select('*', { count: 'exact', head: true }),
          supabase.from('contacts').select('*', { count: 'exact', head: true }),
        ]);
        setStats([
          { label: 'Total Vehicles', count: v.count || 0, icon: <Car className="w-5 h-5" />, color: 'brand' },
          { label: 'Blog Posts', count: b.count || 0, icon: <FileText className="w-5 h-5" />, color: 'emerald' },
          { label: 'Consultations', count: c.count || 0, icon: <MessageSquare className="w-5 h-5" />, color: 'amber' },
          { label: 'Messages', count: m.count || 0, icon: <Mail className="w-5 h-5" />, color: 'cyan' },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const { data } = await supabase
          .from('consultations')
          .select('id, name, email, package_type, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        setConsultations(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setConsultationsLoading(false);
      }
    }
    fetchConsultations();
  }, []);

  const colorMap: Record<string, string> = {
    brand: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    in_progress: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">// dashboard</span>
      </div>
      <h1 className="text-3xl font-display font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-surface-800 rounded w-24 mb-3" />
                    <div className="h-8 bg-surface-800 rounded w-16" />
                  </div>
                  <div className="w-12 h-12 bg-surface-800 rounded-xl" />
                </div>
              </div>
            ))
          : stats.map((stat, i) => (
              <div key={i} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-surface-500 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-white">{stat.count}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorMap[stat.color]}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Consultations</h2>
        {consultationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-surface-500 animate-spin" />
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-500 font-mono">no_consultations_found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left py-3 px-4 text-xs font-mono text-surface-500">name</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-surface-500">email</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-surface-500">package</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-surface-500">status</th>
                  <th className="text-left py-3 px-4 text-xs font-mono text-surface-500">date</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{c.name}</td>
                    <td className="py-3 px-4 text-sm text-surface-400">{c.email}</td>
                    <td className="py-3 px-4 text-sm text-white capitalize">{c.package_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-mono ${statusColors[c.status] || 'bg-surface-800 text-surface-400'}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-surface-500 font-mono">
                      {new Date(c.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
