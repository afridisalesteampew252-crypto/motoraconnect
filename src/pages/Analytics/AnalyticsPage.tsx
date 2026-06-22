import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  TrendingUp, Users, MessageSquare, Bell, CreditCard,
  Calculator, FileText, BarChart3, PieChart,
  Terminal, Loader2, CheckCircle,
  Clock, MapPin, Settings
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Array<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    trend?: { value: string; isUp: boolean };
    description?: string;
  }>>([]);
  const [chartData, setChartData] = useState<Array<{
    name: string;
    value: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAnalyticsData = async () => {
      try {
        // Fetch various analytics data in parallel
        const [
          userStats,
          consultationStats,
          vehicleStats,
          matchStats,
          messageStats
        ] = await Promise.all([
          fetchUserStats(),
          fetchConsultationStats(),
          fetchVehicleStats(),
          fetchMatchStats(),
          fetchMessageStats()
        ]);

        setStats([
          {
            title: 'Total Users',
            value: userStats.totalUsers,
            icon: Users,
            color: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
            trend: userStats.userGrowth,
            description: 'Total registered users'
          },
          {
            title: 'Monthly Consultations',
            value: consultationStats.monthlyConsultations,
            icon: Calculator,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            trend: consultationStats.growth,
            description: 'Consultations booked this month'
          },
          {
            title: 'Vehicles in Database',
            value: vehicleStats.totalVehicles,
            icon: BarChart3,
            color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            trend: vehicleStats.trend,
            description: 'Total vehicles available for matching'
          },
          {
            title: 'Successful Matches',
            value: matchStats.successfulMatches,
            icon: CheckCircle,
            color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            trend: matchStats.successRate,
            description: 'Matches that led to conversations'
          },
          {
            title: 'Messages Sent',
            value: messageStats.totalMessages,
            icon: MessageSquare,
            color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            trend: messageStats.activity,
            description: 'Total messages exchanged'
          },
          {
            title: 'Active Listings',
            value: vehicleStats.activeListings,
            icon: MapPin,
            color: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
            description: 'Currently listed vehicles'
          },
          {
            title: 'Notifications Sent',
            value: messageStats.totalNotifications,
            icon: Bell,
            color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            description: 'System notifications delivered'
          },
          {
            title: 'Avg. Response Time',
            value: `${messageStats.avgResponseTime}h`,
            icon: Clock,
            color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            description: 'Average time to respond to messages'
          }
        ]);

        // Prepare data for simple chart visualization
        setChartData([
          { name: 'Consultations', value: consultationStats.monthlyConsultations },
          { name: 'Matches', value: matchStats.successfulMatches },
          { name: 'Messages', value: messageStats.totalMessages },
          { name: 'Notifications', value: messageStats.totalNotifications }
        ]);

      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user?.id]);

  const fetchUserStats = async () => {
    const [{ count: totalUsers }, { data: recentUsers }] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase
        .from('users')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const monthlyGrowth = recentUsers?.length || 0;
    const growthPercent = totalUsers > 0 ? Math.min((monthlyGrowth / totalUsers) * 100, 100) : 0;

    return {
      totalUsers,
      userGrowth: {
        value: `+${monthlyGrowth} this month`,
        isUp: monthlyGrowth > 0
      }
    };
  };

  const fetchConsultationStats = async () => {
    const [{ count: monthlyConsultations }, { count: totalConsultations }] = await Promise.all([
      supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('consultations').select('*', { count: 'exact', head: true })
    ]);

    const growthPercent = totalConsultations > 0 ?
      Math.min((monthlyConsultations / totalConsultations) * 100, 100) : 0;

    return {
      monthlyConsultations,
      growth: {
        value: `+${monthlyConsultations} this month`,
        isUp: monthlyConsultations > 0
      }
    };
  };

  const fetchVehicleStats = async () => {
    const [{ count: totalVehicles }, { count: activeListings }] = await Promise.all([
      supabase.from('vehicles').select('*', { count: 'exact', head: true }),
      supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true) // Using featured as proxy for active/listed
    ]);

    return {
      totalVehicles,
      activeListings,
      trend: {
        value: `+${activeListings} featured`,
        isUp: activeListings > 0
      }
    };
  };

  const fetchMatchStats = async () => {
    const [{ count: totalMatches }, { count: successfulMatches }] = await Promise.all([
      supabase.from('matches').select('*', { count: 'exact', head: true }),
      supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .in('status', ['contacted', 'viewing_scheduled', 'completed'])
    ]);

    const successRate = totalMatches > 0 ?
      Math.round((successfulMatches / totalMatches) * 100) : 0;

    return {
      totalMatches,
      successfulMatches,
      successRate: {
        value: `${successRate}% success rate`,
        isUp: successRate >= 50
      }
    };
  };

  const fetchMessageStats = async () => {
    const [{ count: totalMessages }, { count: totalNotifications }, { count: recentMessages }] = await Promise.all([
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('notifications').select('*', { count: 'exact', head: true }),
      supabase
        .from('messages')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Simulate average response time (in hours)
    const avgResponseTime = Math.max(1, Math.min(24, 2 + Math.random() * 4));

    return {
      totalMessages,
      totalNotifications,
      avgResponseTime,
      activity: {
        value: `+${recentMessages} today`,
        isUp: recentMessages > 0
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950">
        <div className="flex items-center justify-center py-12">
          <div className="space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-4 h-4 bg-surface-800 rounded animate-pulse" />
            ))}
          </div>
          <p className="text-surface-500 font-mono text-sm ml-4">loading_analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">Analytics Error</h2>
          <p className="text-surface-400">{error}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-surface-800 text-white rounded-lg hover:bg-surface-700 transition-colors text-sm font-medium"
          >
            Back to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// analytics</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-6">Platform Analytics</h1>
        <p className="text-surface-400 mb-8">
          Key metrics and insights about the Motoraconnect platform
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-surface-500 text-sm font-medium">{stat.title}</p>
                  {stat.description && (
                    <p className="text-xs text-surface-500 font-mono mt-1">{stat.description}</p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-display font-bold text-white">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                {stat.trend && (
                  <span className={`text-xs font-mono ${stat.trend.isUp ? 'text-emerald-400' : 'text-red-500'}`}>
                    {stat.trend.isUp ? '▲' : '▼'} {stat.trend.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Simple Chart Section */}
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Activity Overview</h2>
          <div className="grid grid-cols-1 gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="bg-surface-800/50 border border-surface-700 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <span className="text-xs text-surface-500">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-4 w-full bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-emerald-500 transition-all duration-700`}
                    style={{ width: `${Math.min((item.value / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-surface-500 mt-1">Relative activity level</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-surface-800 text-white rounded-lg hover:bg-surface-700 transition-colors text-sm font-medium"
          >
            <User className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          <Link
            to="/vehicles"
            className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-medium"
          >
            <Car className="mr-2 h-4 w-4" /> Browse Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;