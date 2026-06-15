import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  body_type: string;
  engine_cc: number;
  transmission: string;
  fuel_type: string;
  drive_type: string;
  mileage_km: number;
  auction_grade: string;
  estimated_price_jpy: number;
  estimated_price_usd: number;
  image_url: string | null;
}

function getGradeColor(grade: string) {
  const num = parseFloat(grade);
  if (num >= 5) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  if (num >= 4) return 'bg-brand-50 text-brand-700 ring-brand-600/20';
  if (num >= 3.5) return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (num >= 3) return 'bg-orange-50 text-orange-700 ring-orange-600/20';
  return 'bg-red-50 text-red-700 ring-red-600/20';
}

const makes = ['All', 'Toyota', 'Nissan', 'Honda', 'Mitsubishi', 'Subaru', 'Mazda', 'Suzuki'];
const bodyTypes = ['All', 'SUV', 'Sedan', 'Coupe', 'Pickup', 'Van', 'Hatchback'];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [makeFilter, setMakeFilter] = useState('All');
  const [bodyFilter, setBodyFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [makeFilter, bodyFilter, search]);

  async function fetchVehicles() {
    setLoading(true);
    let query = supabase.from('vehicles').select('*').order('created_at', { ascending: false });

    if (makeFilter !== 'All') query = query.eq('make', makeFilter);
    if (bodyFilter !== 'All') query = query.eq('body_type', bodyFilter);
    if (search) query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%`);

    const { data } = await query;
    setVehicles(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-surface-900 to-brand-950 pt-12 pb-20">
        <div className="container-wide">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Vehicle Price Database
          </h1>
          <p className="text-surface-300 text-lg max-w-2xl mb-8">
            Browse real auction prices and market data for Japanese vehicles. Compare makes, models, and estimated costs.
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search by make or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide -mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-64 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary w-full mb-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className={`card p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Filters</h3>
                <button
                  onClick={() => { setMakeFilter('All'); setBodyFilter('All'); setSearch(''); }}
                  className="text-xs text-brand-600 hover:text-brand-700"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label-field">Make</label>
                  <select
                    value={makeFilter}
                    onChange={(e) => setMakeFilter(e.target.value)}
                    className="input-field"
                  >
                    {makes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-field">Body Type</label>
                  <select
                    value={bodyFilter}
                    onChange={(e) => setBodyFilter(e.target.value)}
                    className="input-field"
                  >
                    {bodyTypes.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-surface-500">
                {loading ? 'Searching...' : `${vehicles.length} vehicles found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="aspect-video bg-surface-200 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-surface-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-surface-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-surface-500 text-lg mb-2">No vehicles found</p>
                <p className="text-surface-400 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div key={v.id} className="card-interactive overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-surface-200 to-surface-300 overflow-hidden">
                      {v.image_url ? (
                        <img
                          src={v.image_url}
                          alt={`${v.year} ${v.make} ${v.model}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-surface-900">
                          {v.year} {v.make} {v.model}
                        </h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset shrink-0 ${getGradeColor(v.auction_grade)}`}>
                          Grade {v.auction_grade}
                        </span>
                      </div>

                      <span className="inline-block bg-surface-100 text-surface-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                        {v.body_type}
                      </span>

                      <div className="flex flex-wrap gap-2 mb-3 text-xs text-surface-500">
                        <span className="bg-surface-50 px-2 py-1 rounded">{v.engine_cc?.toLocaleString()} cc</span>
                        <span className="bg-surface-50 px-2 py-1 rounded">{v.transmission}</span>
                        <span className="bg-surface-50 px-2 py-1 rounded">{v.drive_type}</span>
                        {v.fuel_type && <span className="bg-surface-50 px-2 py-1 rounded">{v.fuel_type}</span>}
                      </div>

                      <p className="text-sm text-surface-600 mb-4">
                        {v.mileage_km?.toLocaleString()} km
                      </p>

                      <div className="border-t border-surface-100 pt-3">
                        <p className="text-sm text-surface-500">
                          &yen;{v.estimated_price_jpy?.toLocaleString()}
                        </p>
                        <p className="text-lg font-bold text-surface-900">
                          ${v.estimated_price_usd?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
