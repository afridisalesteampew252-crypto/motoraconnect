import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function ContactsAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) { console.error('Error fetching contacts:', error); }
    finally { setLoading(false); }
  };

  const deleteMessage = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
      setConfirmDeleteId(null);
    } catch (error) { console.error('Error deleting message:', error); }
    finally { setDeletingId(null); }
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
        <span className="text-emerald-400 font-mono text-sm">// contacts</span>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Messages</h1>
        <span className="px-3 py-1 rounded-lg text-sm font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{messages.length}</span>
      </div>

      <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-12"><p className="text-surface-500 font-mono">no_messages_found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  {['name', 'email', 'subject', 'date', 'actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-mono text-surface-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <React.Fragment key={msg.id}>
                    <tr
                      className="border-b border-surface-800/50 hover:bg-surface-800/30 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">{msg.name}</td>
                      <td className="px-6 py-4 text-sm text-surface-400">{msg.email}</td>
                      <td className="px-6 py-4 text-sm text-surface-400 truncate max-w-xs">{msg.subject}</td>
                      <td className="hidden sm:table-cell px-6 py-4 text-sm text-surface-500 font-mono">{formatDate(msg.created_at)}</td>
                      <td className="px-6 py-4 text-sm space-x-3">
                        <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === msg.id ? null : msg.id); }} className="text-surface-400 hover:text-emerald-400 transition-colors">
                          {expandedId === msg.id ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(msg.id); }} className="text-surface-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    {expandedId === msg.id && (
                      <tr className="bg-surface-800/20 border-b-2 border-emerald-500/20">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><h4 className="text-sm font-semibold text-white font-mono mb-1">name</h4><p className="text-surface-400 text-sm">{msg.name}</p></div>
                              <div><h4 className="text-sm font-semibold text-white font-mono mb-1">email</h4><p className="text-surface-400 text-sm">{msg.email}</p></div>
                            </div>
                            <div><h4 className="text-sm font-semibold text-white font-mono mb-1">subject</h4><p className="text-surface-400 text-sm">{msg.subject}</p></div>
                            <div><h4 className="text-sm font-semibold text-white font-mono mb-2">message</h4><p className="text-surface-400 text-sm whitespace-pre-wrap">{msg.message}</p></div>
                            <div className="text-sm text-surface-500 font-mono">
                              received: {new Date(msg.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {confirmDeleteId === msg.id && (
                      <tr className="bg-red-500/5 border-b-2 border-red-500/20">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <p className="text-red-400 font-medium text-sm">Are you sure you want to delete this message?</p>
                            <div className="space-x-2">
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="px-4 py-1.5 bg-surface-800 text-surface-400 rounded-lg text-sm font-mono hover:bg-surface-700 transition-colors" disabled={deletingId === msg.id}>cancel</button>
                              <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-mono hover:bg-red-500/20 transition-colors disabled:opacity-50" disabled={deletingId === msg.id}>{deletingId === msg.id ? 'deleting...' : 'delete'}</button>
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
}
