import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Terminal, ArrowRight } from 'lucide-react';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  body_type: string;
  engine_cc: number;
  transmission: string;
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
  return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
}

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('featured', true)
        .limit(6);
      setVehicles(data || []);
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-surface-950">
        <div className="container-wide">
          <div className="mb-12">
            <div className="h-10 w-64 bg-surface-800 rounded-xl animate-pulse mb-3" />
            <div className="h-6 w-96 bg-surface-800 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) return null;

  return (
    <section className="section-padding bg-surface-950">
      <div className="container-wide">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// featured_vehicles</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">
          Featured Vehicles
        </h2>
        <p className="text-surface-400 text-lg mb-12">Hand-picked from Japanese auctions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="w-full h-full flex items-center justify-center text-surface-600">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {v.year} {v.make} {v.model}
                  </h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${getGradeColor(v.auction_grade)}`}>
                    Grade {v.auction_grade}
                  </span>
                </div>

                <span className="inline-block bg-surface-700/50 text-surface-400 text-xs font-mono px-3 py-1 rounded-lg mb-3">
                  {v.body_type}
                </span>

                <div className="flex flex-wrap gap-2 mb-3 text-xs text-surface-500 font-mono">
                  <span className="bg-surface-800 px-2 py-1 rounded">{v.engine_cc?.toLocaleString()}cc</span>
                  <span className="bg-surface-800 px-2 py-1 rounded">{v.transmission}</span>
                  <span className="bg-surface-800 px-2 py-1 rounded">{v.drive_type}</span>
                </div>

                <p className="text-xs text-surface-500 mb-4 font-mono">
                  {v.mileage_km?.toLocaleString()} km
                </p>

                <div className="border-t border-surface-700/50 pt-3">
                  <p className="text-xs text-surface-500 font-mono">
                    &yen;{v.estimated_price_jpy?.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-white">
                    ${v.estimated_price_usd?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-white text-surface-900 font-semibold px-6 py-3 rounded-xl hover:bg-surface-100 transition-all duration-200">
            View All Vehicles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
