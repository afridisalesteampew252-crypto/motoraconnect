import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter((m) => m.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-6" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-surface-900">Messages</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700">
          {messages.length}
        </span>
      </div>

      <div className="card overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-500 text-lg">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 uppercase tracking-wider">Subject</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-surface-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {messages.map((msg) => (
                  <React.Fragment key={msg.id}>
                    <tr
                      className="hover:bg-surface-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">{msg.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">{msg.email}</td>
                      <td className="px-6 py-4 text-sm text-surface-600 truncate max-w-xs">{msg.subject}</td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-surface-500">{formatDate(msg.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === msg.id ? null : msg.id); }}
                          className="text-brand-600 hover:text-brand-800 font-medium"
                        >
                          {expandedId === msg.id ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(msg.id); }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === msg.id && (
                      <tr className="bg-surface-50 border-b-2 border-brand-200">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-surface-900">Name</h4>
                                <p className="text-surface-700">{msg.name}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-surface-900">Email</h4>
                                <p className="text-surface-700">{msg.email}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-surface-900">Subject</h4>
                              <p className="text-surface-700">{msg.subject}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-surface-900 mb-2">Message</h4>
                              <p className="text-surface-700 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <div className="text-sm text-surface-500">
                              Received: {new Date(msg.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {confirmDeleteId === msg.id && (
                      <tr className="bg-red-50 border-b-2 border-red-200">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <p className="text-red-700 font-medium">Are you sure you want to delete this message?</p>
                            <div className="space-x-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                className="px-4 py-2 bg-surface-200 text-surface-800 rounded hover:bg-surface-300 font-medium"
                                disabled={deletingId === msg.id}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium disabled:opacity-50"
                                disabled={deletingId === msg.id}
                              >
                                {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                              </button>
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
