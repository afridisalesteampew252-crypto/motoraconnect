import React from 'react';
import { useAuthSafe } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  Car, 
  MessageSquare, 
  Bell, 
  Settings, 
  CreditCard, 
  TrendingUp,
  User
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const auth = useAuthSafe();
  const profile = auth?.userProfile;

  const stats = [
    { name: 'Active Matches', value: '12', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Messages', value: '4', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Notifications', value: '2', icon: Bell, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Subscription', value: profile?.subscription_tier || 'Free', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || 'User'}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`${stat.bg} p-3 rounded-lg mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity / Matches */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Vehicle Matches</h2>
              <Link to="/marketplace" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</Link>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No new matches found today. Check back later or update your preferences.</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Messages Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Messages</h2>
              <Link to="/messages" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Open Inbox</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">Support Team</h4>
                      <span className="text-xs text-gray-400">Recently</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">Welcome to Motora Connect! Start by exploring our vehicle marketplace.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wider">{profile?.profile_type || 'Buyer'}</p>
            </div>
            <div className="space-y-3">
              <Link to="/profile" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 border-b border-gray-50">
                <User className="h-5 w-5 mr-3" />
                <span>My Profile</span>
              </Link>
              <Link to="/settings" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 border-b border-gray-50">
                <Settings className="h-5 w-5 mr-3" />
                <span>Account Settings</span>
              </Link>
              <Link to="/upgrade" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
                <CreditCard className="h-5 w-5 mr-3" />
                <span>Subscription</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                List a Vehicle
              </button>
              <button className="w-full py-2 bg-blue-500 bg-opacity-20 border border-blue-400 text-white rounded-lg font-medium hover:bg-opacity-30 transition-colors">
                Search Auctions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
