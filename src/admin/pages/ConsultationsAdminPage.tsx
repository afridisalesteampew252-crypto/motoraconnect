import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  vehicle_interest: string;
  package_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  message: string;
  budget_range: string;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  in_progress: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ConsultationsAdminPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchConsultations(); }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setConsultations(data || []);
    } catch (error) { console.error('Error fetching consultations:', error); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase.from('consultations').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setConsultations(consultations.map(c => c.id === id ? { ...c, status: newStatus as Consultation['status'] } : c));
    } catch (error) { console.error('Error updating consultation status:', error); }
    finally { setUpdatingId(null); }
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-800 rounded w-1/4" />
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-surface-800 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">// consultations</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Consultations</h1>
        <span className="px-3 py-1 rounded-lg text-sm font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{consultations.length}</span>
      </div>

      <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
        {consultations.length === 0 ? (
          <div className="text-center py-12"><p className="text-surface-500 font-mono">no_consultations_found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  {['name', 'email', 'phone', 'country', 'vehicle', 'package', 'status', 'date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono text-surface-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr
                      className="border-b border-surface-800/50 hover:bg-surface-800/30 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    >
                      <td className="px-4 py-3 text-sm text-white font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-surface-400">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-surface-400">{c.phone}</td>
                      <td className="hidden md:table-cell px-4 py-3 text-sm text-surface-400">{c.country}</td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-surface-400">{c.vehicle_interest}</td>
                      <td className="hidden lg:table-cell px-4 py-3 text-sm text-surface-400">{c.package_type}</td>
                      <td className="px-4 py-3">
                        <select
                          value={c.status}
                          onChange={(e) => { e.stopPropagation(); updateStatus(c.id, e.target.value); }}
                          disabled={updatingId === c.id}
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-mono border cursor-pointer bg-transparent disabled:opacity-50 ${statusStyles[c.status] || 'bg-surface-800 text-surface-400 border-surface-700'}`}
                        >
                          <option value="pending">pending</option>
                          <option value="in_progress">in_progress</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-sm text-surface-500 font-mono">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3">
                        {expandedId === c.id ? <ChevronUp className="w-4 h-4 text-surface-500" /> : <ChevronDown className="w-4 h-4 text-surface-500" />}
                      </td>
                    </tr>
                    {expandedId === c.id && (
                      <tr className="bg-surface-800/20 border-b-2 border-emerald-500/20">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-1 font-mono">message</h4>
                              <p className="text-surface-400 text-sm whitespace-pre-wrap">{c.message}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-white font-mono">budget_range</h4>
                                <p className="text-surface-400 text-sm">{c.budget_range}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-white font-mono">submitted</h4>
                                <p className="text-surface-400 text-sm font-mono">{new Date(c.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationsAdminPage;
