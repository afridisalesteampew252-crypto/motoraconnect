import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, SlidersHorizontal, Terminal } from 'lucide-react';

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
  if (num >= 5) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (num >= 4) return 'bg-brand-500/15 text-brand-400 border-brand-500/30';
  if (num >= 3.5) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  return 'bg-red-500/15 text-red-400 border-red-500/30';
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
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="page-header">
        <div className="relative z-10 container-wide">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-sm">// vehicle_database</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Vehicle Price Database
          </h1>
          <p className="text-surface-400 text-lg max-w-2xl mb-8">
            Browse real auction prices and market data for Japanese vehicles.
          </p>
          <div className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                placeholder="Search by make or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-800/60 border border-surface-700 rounded-xl text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <div className="lg:w-56 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary w-full mb-4 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className={`bg-surface-900/50 border border-surface-800 rounded-2xl p-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white text-sm">Filters</h3>
                <button
                  onClick={() => { setMakeFilter('All'); setBodyFilter('All'); setSearch(''); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  clear()
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="label-field">Make</label>
                  <select value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)} className="input-field text-sm">
                    {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Body Type</label>
                  <select value={bodyFilter} onChange={(e) => setBodyFilter(e.target.value)} className="input-field text-sm">
                    {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-surface-500 font-mono">
                {loading ? 'searching...' : `${vehicles.length} results`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface-800/30 border border-surface-700 rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-surface-800 animate-pulse" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-surface-800 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-surface-800 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-12 text-center">
                <p className="text-surface-400 text-lg mb-2">No vehicles found</p>
                <p className="text-surface-600 text-sm font-mono">try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <div key={v.id} className="group bg-surface-800/30 border border-surface-700/50 rounded-2xl overflow-hidden hover:border-surface-600 transition-all duration-300">
                    <div className="aspect-video bg-surface-800 overflow-hidden">
                      {v.image_url ? (
                        <img
                          src={v.image_url}
                          alt={`${v.year} ${v.make} ${v.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-600 text-sm font-mono">no_image</div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-base font-semibold text-white leading-tight">
                          {v.year} {v.make} {v.model}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border shrink-0 ${getGradeColor(v.auction_grade)}`}>
                          {v.auction_grade}
                        </span>
                      </div>

                      <span className="inline-block bg-surface-700/50 text-surface-400 text-xs font-mono px-2.5 py-1 rounded-lg mb-3">
                        {v.body_type}
                      </span>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {[`${v.engine_cc?.toLocaleString()}cc`, v.transmission, v.drive_type, v.fuel_type].filter(Boolean).map((tag) => (
                          <span key={tag} className="bg-surface-800 text-surface-500 text-xs font-mono px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>

                      <p className="text-xs text-surface-500 font-mono mb-4">{v.mileage_km?.toLocaleString()} km</p>

                      <div className="border-t border-surface-700/50 pt-3">
                        <p className="text-xs text-surface-600 font-mono">&yen;{v.estimated_price_jpy?.toLocaleString()}</p>
                        <p className="text-lg font-bold text-white">${v.estimated_price_usd?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
