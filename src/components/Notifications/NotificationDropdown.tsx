import React, { useState, useEffect, useRef } from 'react';
import { useAuthSafe } from '@/hooks/useAuth';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToNotifications,
  Notification
} from '@/services/notificationService';
import { Bell, Check, Trash2, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const auth = useAuthSafe();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(auth.user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const subscription = subscribeToNotifications(auth.user.id, (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth?.user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!auth?.user?.id) return;
    try {
      await markAllNotificationsAsRead(auth.user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_found': return '🚗';
      case 'message': return '💬';
      case 'viewing_scheduled': return '📅';
      case 'offer_received': return '💰';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-400 hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-900 border border-surface-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-800 flex justify-between items-center bg-surface-800/50">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-surface-800">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 hover:bg-surface-800/30 transition-colors ${!notif.read ? 'bg-surface-800/10' : ''}`}
                >
                  <div className="flex items-start">
                    <span className="text-xl mr-3 mt-0.5">{getIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-bold truncate ${!notif.read ? 'text-white' : 'text-surface-300'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-1 hover:bg-surface-700 rounded text-surface-500 hover:text-emerald-400"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-surface-400 line-clamp-2 mb-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-surface-500 font-medium">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-surface-700 mx-auto mb-3" />
                <p className="text-sm text-surface-500">No notifications yet.</p>
              </div>
            )}
          </div>

          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="block py-3 text-center text-xs font-bold text-surface-400 hover:text-white border-t border-surface-800 hover:bg-surface-800/50 transition-all"
          >
            View all in Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
