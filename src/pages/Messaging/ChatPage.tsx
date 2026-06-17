import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthSafe } from '@/hooks/useAuth';
import { 
  getConversation, 
  sendMessage, 
  subscribeToMessages, 
  markMessageAsRead 
} from '@/services/messagingService';
import { ChevronLeft, Send, Paperclip, User, Info } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/services/supabase';

const ChatPage: React.FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const auth = useAuthSafe();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!auth?.user?.id || !partnerId) return;

    const fetchData = async () => {
      try {
        // Fetch partner info
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', partnerId)
          .single();
        
        if (userError) throw userError;
        setPartner(userData);

        // Fetch messages
        const data = await getConversation(auth.user!.id, partnerId);
        setMessages(data);
        
        // Mark unread messages as read
        const unreadIds = data
          .filter(m => m.receiver_id === auth.user?.id && !m.read)
          .map(m => m.id);
        
        for (const id of unreadIds) {
          await markMessageAsRead(id);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    fetchData();

    // Subscribe to new messages
    const subscription = subscribeToMessages(auth.user.id, (payload) => {
      if (payload.senderId === partnerId) {
        setMessages(prev => [...prev, payload]);
        markMessageAsRead(payload.id);
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth?.user?.id, partnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth?.user?.id || !partnerId || sending) return;

    setSending(true);
    try {
      const sentMsg = await sendMessage(auth.user.id, partnerId, newMessage.trim());
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white shadow-sm border-x border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/messages')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
            {partner?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{partner?.full_name || 'User'}</h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === auth?.user?.id;
            const showDate = idx === 0 || 
              format(new Date(messages[idx-1].created_at), 'yyyy-MM-dd') !== format(new Date(msg.created_at), 'yyyy-MM-dd');

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-gray-200/50 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {format(new Date(msg.created_at), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      {format(new Date(msg.created_at), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="h-full flex flex-center items-center justify-center text-center">
            <div className="max-w-xs">
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">Start a conversation</h3>
              <p className="text-sm text-gray-500">Send a message to start chatting with {partner?.full_name || 'this user'}.</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <button type="button" className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-2 rounded-full transition-all ${
              newMessage.trim() && !sending 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
