import { useEffect, useState, ReactNode } from 'react';
import { Car, FileText, MessageSquare, Mail, Loader2 } from 'lucide-react';
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
          { label: 'Total Vehicles', count: v.count || 0, icon: <Car className="w-6 h-6" />, color: 'brand' },
          { label: 'Blog Posts', count: b.count || 0, icon: <FileText className="w-6 h-6" />, color: 'emerald' },
          { label: 'Consultations', count: c.count || 0, icon: <MessageSquare className="w-6 h-6" />, color: 'amber' },
          { label: 'Messages', count: m.count || 0, icon: <Mail className="w-6 h-6" />, color: 'sky' },
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
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    in_progress: 'bg-brand-50 text-brand-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-24 mb-3" />
                    <div className="h-8 bg-surface-200 rounded w-16" />
                  </div>
                  <div className="w-12 h-12 bg-surface-200 rounded-full" />
                </div>
              </div>
            ))
          : stats.map((stat, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-surface-500 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-surface-900">{stat.count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[stat.color] || 'bg-surface-100 text-surface-600'}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-surface-900 mb-6">Recent Consultations</h2>
        {consultationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-surface-400 animate-spin" />
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-500">No consultations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700">Package</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-surface-900">{c.name}</td>
                    <td className="py-3 px-4 text-sm text-surface-600">{c.email}</td>
                    <td className="py-3 px-4 text-sm text-surface-900 capitalize">{c.package_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[c.status] || 'bg-surface-100 text-surface-600'}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-surface-500">
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
