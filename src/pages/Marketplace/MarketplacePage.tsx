import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMatchesForUser } from '../../services/matchingService';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Car, Star, MapPin, Calendar, ArrowRight, Filter, TrendingUp, Terminal } from 'lucide-react';

interface Match {
  id: string;
  vehicle_id: string;
  seller_id: string;
  match_score: number;
  match_reason: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    estimated_price_usd?: number;
    mileage_km?: number;
    auction_grade?: string;
    image_url?: string;
  };
}

const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMatches = async () => {
      try {
        const matchData = await getMatchesForUser(user.id, 'buyer') || [];

        const enrichedMatches = await Promise.all(matchData.map(async (match: Match) => {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', match.vehicle_id)
            .maybeSingle();
          return { ...match, vehicle };
        }));

        setMatches(enrichedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-surface-500 font-mono text-sm">loading_matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// marketplace</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Vehicle Match Marketplace</h1>
            <p className="text-surface-400 mt-2">Personalized recommendations based on your preferences.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="flex items-center px-4 py-2 border border-surface-700 rounded-lg text-surface-300 hover:bg-surface-800 transition-colors text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm"
            >
              Update Preferences
            </Link>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden hover:border-surface-700 transition-all group">
                <div className="relative h-48 bg-surface-800 overflow-hidden">
                  {match.vehicle?.image_url ? (
                    <img
                      src={match.vehicle.image_url}
                      alt={match.vehicle.make}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-12 h-12 text-surface-700" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-surface-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center border border-surface-700">
                    <TrendingUp className="h-3 w-3 text-emerald-400 mr-1" />
                    <span className="text-xs font-bold text-white">{match.match_score}% Match</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{match.vehicle?.year} {match.vehicle?.make} {match.vehicle?.model}</h3>
                      <div className="flex items-center text-surface-500 text-sm mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        International
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">${match.vehicle?.estimated_price_usd?.toLocaleString() || 'N/A'}</p>
                      <p className="text-[10px] text-surface-500 font-mono uppercase tracking-wider">estimated</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-surface-400">
                      <Star className="h-4 w-4 text-amber-400 mr-2" />
                      Grade: {match.vehicle?.auction_grade || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-surface-400">
                      <Calendar className="h-4 w-4 text-brand-400 mr-2" />
                      {match.vehicle?.mileage_km?.toLocaleString() || 'N/A'} km
                    </div>
                  </div>

                  {match.match_reason && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">why_it_matches</p>
                      <p className="text-xs text-surface-300 leading-relaxed">{match.match_reason}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Link
                      to={`/vehicles`}
                      className="flex-1 text-center py-2 border border-surface-700 rounded-xl text-sm font-medium text-surface-300 hover:bg-surface-800 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/messages/${match.seller_id}`}
                      className="flex-1 text-center py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      Contact Seller
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface-900/50 border border-surface-800 rounded-3xl">
            <div className="h-20 w-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="h-10 w-10 text-surface-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">No Matches Found Yet</h2>
            <p className="text-surface-400 max-w-md mx-auto mb-8">
              We haven't found any vehicles that match your current preferences. Try broadening your search criteria.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-medium hover:bg-emerald-500/20 transition-all"
            >
              Update My Preferences
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
