import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
  if (num >= 5) return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  if (num >= 4) return 'bg-brand-50 text-brand-700 ring-brand-600/20';
  if (num >= 3.5) return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  if (num >= 3) return 'bg-orange-50 text-orange-700 ring-orange-600/20';
  return 'bg-red-50 text-red-700 ring-red-600/20';
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
      <section className="section-padding bg-surface-50">
        <div className="container-wide">
          <div className="mb-12">
            <div className="h-10 w-64 bg-surface-200 rounded-xl animate-pulse mb-3" />
            <div className="h-6 w-96 bg-surface-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-video bg-surface-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-surface-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-surface-200 rounded animate-pulse w-2/3" />
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
    <section className="section-padding bg-surface-50">
      <div className="container-wide">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-2">
            Featured Vehicles
          </h2>
          <p className="text-lg text-surface-500">Hand-picked vehicles from Japanese auctions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className="text-center mt-10">
          <Link to="/vehicles" className="btn-primary">
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
