import React, { useState, useEffect } from 'react';
import { useAuthSafe } from '@/hooks/useAuth';
import { getMatchesForUser } from '@/services/matchingService';
import { supabase } from '@/services/supabase';
import { Link } from 'react-router-dom';
import { Car, Star, MapPin, Calendar, ArrowRight, Filter, TrendingUp } from 'lucide-react';

const MarketplacePage: React.FC = () => {
  const auth = useAuthSafe();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.user?.id || !auth?.userProfile) return;

    const fetchMatches = async () => {
      try {
        const type = auth.userProfile.profile_type === 'seller' ? 'seller' : 'buyer';
        const matchData = await getMatchesForUser(auth.user.id, type);
        
        // Enrich match data with vehicle details
        const enrichedMatches = await Promise.all(matchData.map(async (match: any) => {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', match.vehicle_id)
            .single();
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
  }, [auth?.user?.id, auth?.userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Match Marketplace</h1>
          <p className="text-gray-600 mt-2">Personalized recommendations based on your preferences.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update Preferences
          </Link>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              {/* Vehicle Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={match.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'} 
                  alt={match.vehicle?.make}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center shadow-sm">
                  <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                  <span className="text-xs font-bold text-gray-900">{match.match_score}% Match</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{match.vehicle?.year} {match.vehicle?.make} {match.vehicle?.model}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {match.vehicle?.location || 'International'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">${match.vehicle?.price?.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Cost</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    Grade: {match.vehicle?.grade || '4.5'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                    Mileage: {match.vehicle?.mileage?.toLocaleString() || '45,000'} km
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3 mb-6">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Why it matches:</p>
                  <p className="text-xs text-blue-600 leading-relaxed">{match.match_reason}</p>
                </div>

                <div className="flex space-x-3">
                  <Link 
                    to={`/vehicles/${match.vehicle_id}`}
                    className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/messages/${match.seller_id}`}
                    className="flex-1 text-center py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Contact Seller
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Matches Found Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            We haven't found any vehicles that match your current preferences. Try broadening your search criteria.
          </p>
          <Link 
            to="/profile" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Update My Preferences
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
