import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Car, MessageSquare, Bell, Settings, CreditCard, TrendingUp, User, Terminal } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Matches', value: '12', icon: TrendingUp, color: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
    { name: 'Messages', value: '4', icon: MessageSquare, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Notifications', value: '2', icon: Bell, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { name: 'Subscription', value: 'Free', icon: CreditCard, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  ];

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
                  <stat.icon className="h-4 w-4" />
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
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-surface-700 mx-auto mb-3" />
                  <p className="text-surface-500 text-sm">No new matches found today. Check back later or update your preferences.</p>
                  <Link to="/profile" className="mt-4 inline-block px-4 py-2 bg-surface-800 text-white rounded-lg hover:bg-surface-700 transition-colors text-sm">
                    Update Preferences
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
                <Link to="/messages" className="text-sm text-brand-400 hover:text-brand-300 font-mono">open_inbox</Link>
              </div>
              <div className="divide-y divide-surface-800">
                {[1, 2].map((i) => (
                  <Link key={i} to="/messages" className="p-4 hover:bg-surface-800/50 transition-colors flex items-center">
                    <div className="h-10 w-10 rounded-full bg-surface-800 flex items-center justify-center mr-4">
                      <User className="h-5 w-5 text-surface-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-white">Support Team</h4>
                        <span className="text-xs text-surface-500 font-mono">recently</span>
                      </div>
                      <p className="text-sm text-surface-400 truncate">Welcome to Motoraconnect! Start by exploring our vehicle marketplace.</p>
                    </div>
                  </Link>
                ))}
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
                <p className="text-sm text-surface-500 font-mono">buyer</p>
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
                <button className="w-full py-2 bg-white text-surface-900 rounded-lg font-medium hover:bg-surface-100 transition-colors text-sm">
                  List a Vehicle
                </button>
                <button className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm">
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
