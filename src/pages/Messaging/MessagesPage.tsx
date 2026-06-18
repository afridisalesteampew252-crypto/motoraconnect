import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserConversations } from '../../services/messagingService';
import { Link } from 'react-router-dom';
import { Search, User, MessageSquare, Clock, Terminal } from 'lucide-react';

interface Conversation {
  partnerId: string;
  partner: { full_name?: string } | null;
  lastMessage: { content: string; created_at: string; sender_id: string; receiver_id: string };
  unreadCount: number;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      try {
        const convMap = await getUserConversations(user.id);
        const convList = Array.from(convMap.entries()).map(([partnerId, messages]) => {
          const lastMessage = messages[0];
          const partner = lastMessage.sender_id === user.id ? lastMessage.receiver : lastMessage.sender;
          return {
            partnerId,
            partner,
            lastMessage,
            unreadCount: messages.filter((m) => m.receiver_id === user.id && !m.read).length
          };
        });
        setConversations(convList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  const filteredConversations = conversations.filter(c =>
    c.partner?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// messages</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-8 flex items-center">
          <MessageSquare className="mr-3 h-6 w-6 text-emerald-400" />
          Messages
        </h1>

        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-surface-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-surface-800">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
                <p className="text-surface-500 font-mono text-sm">loading_messages...</p>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <Link
                  key={conv.partnerId}
                  to={`/messages/${conv.partnerId}`}
                  className="flex items-center p-4 hover:bg-surface-800/50 transition-colors group"
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      {conv.partner?.full_name?.charAt(0) || 'U'}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-900">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-white' : 'text-surface-300'}`}>
                        {conv.partner?.full_name || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-surface-500 flex items-center font-mono">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(conv.lastMessage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-surface-400'}`}>
                      {conv.lastMessage.sender_id === user?.id ? 'You: ' : ''}
                      {conv.lastMessage.content}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-surface-700 mx-auto mb-4" />
                <p className="text-surface-500 font-mono">no_messages_found</p>
                {searchTerm && <p className="text-sm text-surface-600 mt-1">Try a different search term.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
