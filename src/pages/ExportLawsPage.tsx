import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Globe, Shield, AlertCircle, Info, Search, MapPin } from 'lucide-react';

const ExportLawsPage: React.FC = () => {
  const [laws, setLaws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const { data, error } = await supabase
          .from('export_laws')
          .select('*')
          .order('country_name', { ascending: true });
        
        if (error) throw error;
        setLaws(data || []);
      } catch (error) {
        console.error('Error fetching export laws:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaws();
  }, []);

  const filteredLaws = laws.filter(law => 
    law.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.country_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="page-header">
        <div className="container-wide">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Global Export Regulations</h1>
          <p className="text-surface-400 text-lg max-w-2xl">
            Stay updated with the latest import laws, age restrictions, and duty structures for your destination country.
          </p>
        </div>
      </div>

      <div className="container-wide py-12">
        {/* Search */}
        <div className="max-w-md mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-500" />
            <input
              type="text"
              placeholder="Search by country..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaws.map((law) => (
              <div key={law.id} className="bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{law.country_name}</h3>
                      <p className="text-xs font-mono text-surface-500">{law.country_code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Age Restriction</p>
                      <p className="text-sm text-surface-200">{law.age_restriction || 'None'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Inspection</p>
                      <p className="text-sm text-surface-200">{law.inspection_required || 'Not required'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Duties & Taxes</p>
                      <p className="text-sm text-surface-200 leading-relaxed">{law.import_duties_description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-surface-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-surface-600 uppercase">
                    Last Updated: {new Date(law.last_updated).toLocaleDateString()}
                  </span>
                  <button className="text-xs font-bold text-brand-400 hover:text-brand-300">
                    Full Guide →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredLaws.length === 0 && (
          <div className="text-center py-20 bg-surface-900/50 rounded-3xl border border-dashed border-surface-800">
            <MapPin className="h-12 w-12 text-surface-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Country Not Found</h2>
            <p className="text-surface-500 max-w-md mx-auto">
              We haven't added regulations for this country yet. Contact us for a custom consultation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportLawsPage;
