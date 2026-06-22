import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Car, MessageSquare, Bell, Settings, CreditCard, TrendingUp, User, Terminal, Loader2, Mail } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Array<{
    name: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string
  }>>([]);
  const [recentMatches, setRecentMatches] = useState<Array<any>>([]);
  const [recentMessages, setRecentMessages] = useState<Array<any>>([]);
  const [recentNotifications, setRecentNotifications] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | 'both' | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user profile data to determine role and subscription tier
        const { data: profileData } = await supabase
          .from('users')
          .select('profile_type, subscription_tier, full_name')
          .eq('id', user.id)
          .maybeSingle();

        // Determine user role
        let role: 'buyer' | 'seller' | 'both' | null = null;
        if (profileData) {
          const profileType = profileData.profile_type || 'buyer';
          if (profileType === 'both') {
            role = 'both';
          } else if (profileType === 'seller') {
            role = 'seller';
          } else {
            role = 'buyer';
          }
        }
        setUserRole(role);

        // Fetch match count and recent matches with vehicle data
        let matchCount = 0;
        let matchesData: Array<any> = [];
        if (role === 'buyer' || role === 'both') {
          const { data: buyerMatches } = await supabase
            .from('matches')
            .select(`
              *,
              vehicle:vehicle_id (
                id,
                make,
                model,
                year,
                condition,
                price
              )
            `)
            .eq('buyer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          matchesData = buyerMatches || [];
          matchCount += matchesData.length;
        }
        if (role === 'seller' || role === 'both') {
          const { data: sellerMatches } = await supabase
            .from('matches')
            .select(`
              *,
              vehicle:vehicle_id (
                id,
                make,
                model,
                year,
                condition,
                price
              )
            `)
            .eq('seller_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          // Avoid double counting if user is both
          if (role === 'both') {
            // Combine and deduplicate by match ID
            const allMatches = [...(matchesData || []), ...(sellerMatches || [])];
            const uniqueMatches = allMatches.reduce((acc: any[], match: any) => {
              if (!acc.some((m: any) => m.id === match.id)) {
                acc.push(match);
              }
              return acc;
            }, []);
            setRecentMatches(uniqueMatches.slice(0, 5));
            matchCount = uniqueMatches.length;
          } else {
            setRecentMatches(sellerMatches || []);
            matchCount += sellerMatches.length;
          }
        } else {
          setRecentMatches([]);
        }

        // If we haven't set recentMatches yet (for buyer-only or seller-only cases)
        if (role === 'buyer' && matchesData.length > 0) {
          setRecentMatches(matchesData);
        } else if (role === 'seller' && matchesData.length === 0) {
          setRecentMatches([]);
        }

        // Fetch unread message count
        const { count: unreadMessageCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false);

        // Fetch recent messages
        const { data: messagesData } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (id, full_name, email),
            receiver:receiver_id (id, full_name, email)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch unread notification count
        const { count: unreadNotificationCount } = await supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false);

        // Fetch recent notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Set stats
        setStats([
          {
            name: 'Active Matches',
            value: matchCount.toString(),
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
          },
          {
            name: 'Messages',
            value: `${unreadMessageCount}`,
            icon: <MessageSquare className="w-5 h-5" />,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          },
          {
            name: 'Notifications',
            value: `${unreadNotificationCount}`,
            icon: <Bell className="w-5 h-5" />,
            color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          },
          {
            name: 'Subscription',
            value: (profileData?.subscription_tier || 'free').toUpperCase(),
            icon: <CreditCard className="w-5 h-5" />,
            color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
          }
        ]);

        setRecentMessages(messagesData || []);
        setRecentNotifications(notificationsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback values
        setStats([
          {
            name: 'Active Matches',
            value: '0',
            icon: TrendingUp,
            color: 'bg-brand-500/10 text-brand-400 border-brand-500/20'
          },
          {
            name: 'Messages',
            value: '0',
            icon: MessageSquare,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          },
          {
            name: 'Notifications',
            value: '0',
            icon: Bell,
            color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          },
          {
            name: 'Subscription',
            value: 'FREE',
            icon: CreditCard,
            color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
          }
        ]);
        setRecentMatches([]);
        setRecentMessages([]);
        setRecentNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-surface-500 font-mono text-sm">loading_dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// dashboard</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-surface-400 mb-8">Here's what's happening with your account today.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-surface-500 font-mono">{stat.name.toLowerCase()}</p>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Recent Vehicle Matches</h2>
                <Link to="/marketplace" className="text-sm text-brand-400 hover:text-brand-300 font-mono">view_all</Link>
              </div>
              <div className="p-6">
                {recentMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-surface-700 mx-auto mb-3" />
                    <p className="text-surface-500 text-sm">No matches found yet. Keep browsing vehicles to find your perfect match!</p>
                    <Link to="/vehicles" className="mt-4 inline-block px-4 py-2 bg-surface-800 text-white rounded-lg hover:bg-surface-700 transition-colors text-sm">
                      Browse Vehicles
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="bg-surface-900/50 border border-surface-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{match.vehicle?.make} {match.vehicle?.model}</h3>
                            <p className="text-sm text-surface-400">{match.vehicle?.year} • {match.vehicle?.condition}</p>
                          </div>
                          <div className={`text-xs font-mono px-2 py-0.5 rounded-lg ${match.match_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : match.match_score >= 60 ? 'bg-brand-500/20 text-brand-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {match.match_score}% Match
                          </div>
                        </div>
                        <p className="text-surface-400 text-sm">{match.match_reason || 'Good match based on your preferences'}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <Link
                            to={`/vehicle/${match.vehicle_id}`}
                            className="text-sm text-brand-400 hover:text-brand-300 font-mono"
                          >
                            View Vehicle
                          </Link>
                          {match.status === 'pending' && (
                            <button
                              onClick={() => /* acceptMatch(match.id) */}
                              className="px-3 py-1 bg-surface-800 text-white rounded-hover hover:bg-surface-700 transition-colors text-xs font-mono"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
                <Link to="/messages" className="text-sm text-brand-400 hover:text-brand-300 font-mono">open_inbox</Link>
              </div>
              <div className="divide-y divide-surface-800">
                {recentMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-10 w-10 text-surface-700 mx-auto mb-3" />
                    <p className="text-surface-500 text-sm">No new messages. Start a conversation by connecting with a match!</p>
                  </div>
                ) : (
                  <>
                    {recentMessages.map((message) => (
                      <Link
                        key={message.id}
                        to={`/messages/${message.id}`}
                        className="p-4 hover:bg-surface-800/50 transition-colors flex items-center border-b divide-surface-800 last:divide-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-surface-800 flex items-center justify-center mr-4">
                            {message.sender_id === user.id ? (
                              <User className="h-5 w-5 text-surface-500" />
                            ) : (
                              <Car className="h-5 w-5 text-surface-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-white">
                                {message.sender_id === user.id
                                  ? 'You'
                                  : message.sender?.full_name || message.sender?.email?.split('@')[0] || 'Unknown'}
                              </h4>
                              <span className="text-xs text-surface-500 font-mono">
                                {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-sm text-surface-400 truncate max-w-[200px]">
                              {message.content}
                            </p>
                            {!message.read && (
                              <div className="mt-1">
                                <span className="text-xs text-emerald-500 font-mono">unread</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="text-center mb-6">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-400">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{user?.email?.split('@')[0] || 'User'}</h3>
                <p className="text-sm text-surface-500 font-mono">
                  {userRole === 'buyer' ? 'buyer' : userRole === 'seller' ? 'seller' : 'buyer & seller'}
                </p>
              </div>
              <div className="space-y-2">
                <Link to="/profile" className="flex items-center text-surface-400 hover:text-white transition-colors py-2 border-b border-surface-800 text-sm">
                  <User className="h-4 w-4 mr-3" /><span>My Profile</span>
                </Link>
                <Link to="/settings" className="flex items-center text-surface-400 hover:text-white transition-colors py-2 border-b border-surface-800 text-sm">
                  <Settings className="h-4 w-4 mr-3" /><span>Account Settings</span>
                </Link>
                <Link to="/upgrade" className="flex items-center text-surface-400 hover:text-white transition-colors py-2 text-sm">
                  <CreditCard className="h-4 w-4 mr-3" /><span>Subscription</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-brand-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full py-2 bg-white text-surface-900 rounded-lg font-medium hover:bg-surface-100 transition-colors text-sm"
                  onClick={() => /* handleListVehicle() */}
                >
                  List a Vehicle
                </button>
                <button
                  className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover-bg-white/20 transition-colors text-sm"
                  onClick={() => /* handleSearchAuctions() */}
                >
                  Search Auctions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;