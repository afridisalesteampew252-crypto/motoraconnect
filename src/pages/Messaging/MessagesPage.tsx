import React, { useState, useEffect } from 'react';
import { useAuthSafe } from '@/hooks/useAuth';
import { getUserConversations, Message } from '@/services/messagingService';
import { Link } from 'react-router-dom';
import { Search, User, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MessagesPage: React.FC = () => {
  const auth = useAuthSafe();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      if (!auth?.user?.id) return;
      try {
        const convMap = await getUserConversations(auth.user.id);
        const convList = Array.from(convMap.entries()).map(([partnerId, messages]) => {
          const lastMessage = messages[0]; // Already sorted by created_at desc
          const partner = lastMessage.sender_id === auth.user?.id ? lastMessage.receiver : lastMessage.sender;
          return {
            partnerId,
            partner,
            lastMessage,
            unreadCount: messages.filter((m: any) => m.receiver_id === auth.user?.id && !m.read).length
          };
        });
        setConversations(convList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(setLoading as any); // Just to satisfy linter if needed, but actually:
        setLoading(false);
      }
    };

    fetchConversations();
  }, [auth?.user?.id]);

  const filteredConversations = conversations.filter(c => 
    c.partner?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="mr-3 h-6 w-6 text-blue-600" />
          Messages
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your messages...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <Link
                key={conv.partnerId}
                to={`/messages/${conv.partnerId}`}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {conv.partner?.full_name?.charAt(0) || 'U'}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conv.partner?.full_name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {conv.lastMessage.sender_id === auth?.user?.id ? 'You: ' : ''}
                    {conv.lastMessage.content}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">No messages found.</p>
              {searchTerm && <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
