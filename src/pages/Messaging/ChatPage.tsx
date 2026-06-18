import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getConversation, sendMessage, subscribeToMessages, markMessageAsRead } from '../../services/messagingService';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Send, Paperclip, User, Info, Terminal, MessageSquare } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { partnerId } = useParams<{ partnerId: string }>();
  const { user } = useAuth();
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
    if (!user?.id || !partnerId) return;

    const fetchData = async () => {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', partnerId)
          .maybeSingle();

        setPartner(userData);

        const data = await getConversation(user.id, partnerId);
        setMessages(data || []);

        const unreadIds = (data || [])
          .filter(m => m.receiver_id === user.id && !m.read)
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

    const subscription = subscribeToMessages(user.id, (payload) => {
      if (payload.senderId === partnerId) {
        setMessages(prev => [...prev, payload]);
        markMessageAsRead(payload.id);
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, partnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !partnerId || sending) return;

    setSending(true);
    try {
      const sentMsg = await sendMessage(user.id, partnerId, newMessage.trim());
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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-surface-500 font-mono text-sm">loading_chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-surface-900/50 border border-surface-800 rounded-2xl my-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/messages')}
              className="mr-4 p-2 hover:bg-surface-800 rounded-lg transition-colors text-surface-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center text-emerald-400 font-bold mr-3">
              {partner?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="font-semibold text-white">{partner?.full_name || 'User'}</h2>
              <p className="text-xs text-emerald-400 font-mono">online</p>
            </div>
          </div>
          <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors text-surface-500">
            <Info className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-950/50">
          {messages.length > 0 ? (
            messages.map((msg, idx) => {
              const isMe = msg.sender_id === user?.id;
              const prevMsg = messages[idx - 1];
              const showDate = idx === 0 || !prevMsg ||
                new Date(prevMsg.created_at).toDateString() !== new Date(msg.created_at).toDateString();

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="px-3 py-1 bg-surface-800 text-surface-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-white rounded-tr-none'
                        : 'bg-surface-800 border border-surface-700 text-white rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-emerald-400/60' : 'text-surface-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-xs">
                <div className="h-16 w-16 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-surface-600" />
                </div>
                <h3 className="text-white font-semibold mb-1">Start a conversation</h3>
                <p className="text-sm text-surface-400">Send a message to start chatting with {partner?.full_name || 'this user'}.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-surface-800">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <button type="button" className="p-2 text-surface-500 hover:text-emerald-400 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-surface-800 border border-surface-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className={`p-2 rounded-xl transition-all ${
                newMessage.trim() && !sending
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-surface-800 text-surface-600 border border-surface-700'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
