import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Terminal, X, Check, Trash2, Edit2 } from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  body_type: string;
  engine_cc: number;
  transmission: string;
  fuel_type: string;
  drive_type: string;
  mileage_km: number;
  auction_grade: string;
  estimated_price_jpy: number;
  estimated_price_usd: number;
  image_url: string;
  featured: boolean;
  created_at?: string;
}

interface FormData {
  make: string;
  model: string;
  year: number;
  body_type: string;
  engine_cc: number;
  transmission: string;
  fuel_type: string;
  drive_type: string;
  mileage_km: number;
  auction_grade: string;
  estimated_price_jpy: number;
  estimated_price_usd: number;
  image_url: string;
  featured: boolean;
}

const emptyFormData: FormData = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  body_type: 'SUV',
  engine_cc: 0,
  transmission: 'Automatic',
  fuel_type: 'Petrol',
  drive_type: 'FWD',
  mileage_km: 0,
  auction_grade: '',
  estimated_price_jpy: 0,
  estimated_price_usd: 0,
  image_url: '',
  featured: false,
};

export default function VehiclesAdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchVehicles(); }, []);

  useEffect(() => {
    if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); }
  }, [toast]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setVehicles(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
      setError(message);
      setToast({ message, type: 'error' });
    } finally { setLoading(false); }
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({ make: vehicle.make, model: vehicle.model, year: vehicle.year, body_type: vehicle.body_type, engine_cc: vehicle.engine_cc, transmission: vehicle.transmission, fuel_type: vehicle.fuel_type, drive_type: vehicle.drive_type, mileage_km: vehicle.mileage_km, auction_grade: vehicle.auction_grade, estimated_price_jpy: vehicle.estimated_price_jpy, estimated_price_usd: vehicle.estimated_price_usd, image_url: vehicle.image_url, featured: vehicle.featured });
    } else {
      setEditingId(null);
      setFormData(emptyFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => { setShowModal(false); setEditingId(null); setFormData(emptyFormData); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    if (type === 'checkbox') { setFormData(prev => ({ ...prev, [name]: target.checked })); }
    else if (type === 'number') { setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) })); }
    else { setFormData(prev => ({ ...prev, [name]: value })); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const { error: err } = await supabase.from('vehicles').update(formData).eq('id', editingId);
        if (err) throw err;
        setToast({ message: 'Vehicle updated successfully', type: 'success' });
      } else {
        const { error: err } = await supabase.from('vehicles').insert([formData]);
        if (err) throw err;
        setToast({ message: 'Vehicle created successfully', type: 'success' });
      }
      handleCloseModal();
      await fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setToast({ message, type: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    setSubmitting(true);
    try {
      const { error: err } = await supabase.from('vehicles').delete().eq('id', id);
      if (err) throw err;
      setToast({ message: 'Vehicle deleted successfully', type: 'success' });
      setDeleteConfirm(null);
      await fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setToast({ message, type: 'error' });
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl text-sm font-semibold z-50 ${
          toast.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>{toast.message}</div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400 font-mono text-sm">// vehicles</span>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Vehicle Management</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12"><p className="text-surface-500 font-mono">loading_vehicles...</p></div>
      ) : vehicles.length === 0 ? (
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl text-center py-12">
          <p className="text-surface-500 mb-4 font-mono">no_vehicles_found</p>
          <button onClick={() => handleOpenModal()} className="btn-primary text-sm">Add the first vehicle</button>
        </div>
      ) : (
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  {['Image', 'Year', 'Make', 'Model', 'Body', 'CC', 'Grade', 'JPY', 'USD', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-mono text-surface-500">{h.toLowerCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      {vehicle.image_url && <img src={vehicle.image_url} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-10 w-14 object-cover rounded-lg" />}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-mono">{vehicle.year}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{vehicle.make}</td>
                    <td className="px-4 py-3 text-sm text-white">{vehicle.model}</td>
                    <td className="px-4 py-3 text-sm text-surface-400">{vehicle.body_type}</td>
                    <td className="px-4 py-3 text-sm text-surface-400 font-mono">{vehicle.engine_cc}</td>
                    <td className="px-4 py-3 text-sm text-surface-400">{vehicle.auction_grade}</td>
                    <td className="px-4 py-3 text-sm text-white font-mono">¥{vehicle.estimated_price_jpy.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-white font-mono">${vehicle.estimated_price_usd.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-mono ${vehicle.featured ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-surface-800 text-surface-500'}`}>
                        {vehicle.featured ? 'yes' : 'no'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button onClick={() => handleOpenModal(vehicle)} className="text-surface-400 hover:text-emerald-400 transition-colors"><Edit2 className="w-4 h-4 inline" /></button>
                      <button onClick={() => setDeleteConfirm(vehicle.id)} className="text-surface-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-900 border-b border-surface-800 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <button onClick={handleCloseModal} className="text-surface-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Make</label><input type="text" name="make" value={formData.make} onChange={handleInputChange} required className="input-field" placeholder="e.g., Toyota" /></div>
                <div><label className="label-field">Model</label><input type="text" name="model" value={formData.model} onChange={handleInputChange} required className="input-field" placeholder="e.g., Land Cruiser" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Year</label><input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="input-field" /></div>
                <div><label className="label-field">Body Type</label><select name="body_type" value={formData.body_type} onChange={handleInputChange} className="input-field"><option>SUV</option><option>Sedan</option><option>Coupe</option><option>Pickup</option><option>Van</option><option>Hatchback</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Engine CC</label><input type="number" name="engine_cc" value={formData.engine_cc} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="label-field">Transmission</label><select name="transmission" value={formData.transmission} onChange={handleInputChange} className="input-field"><option>Automatic</option><option>Manual</option><option>CVT</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Fuel Type</label><select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} className="input-field"><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></div>
                <div><label className="label-field">Drive Type</label><select name="drive_type" value={formData.drive_type} onChange={handleInputChange} className="input-field"><option>FWD</option><option>RWD</option><option>AWD</option><option>4WD</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Mileage (km)</label><input type="number" name="mileage_km" value={formData.mileage_km} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="label-field">Auction Grade</label><input type="text" name="auction_grade" value={formData.auction_grade} onChange={handleInputChange} className="input-field" placeholder="e.g., 4, 4.5" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="label-field">Price (JPY)</label><input type="number" name="estimated_price_jpy" value={formData.estimated_price_jpy} onChange={handleInputChange} className="input-field" /></div>
                <div><label className="label-field">Price (USD)</label><input type="number" name="estimated_price_usd" value={formData.estimated_price_usd} onChange={handleInputChange} className="input-field" /></div>
              </div>
              <div><label className="label-field">Image URL</label><input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} className="input-field" placeholder="https://example.com/image.jpg" /></div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-emerald-500 focus:ring-emerald-500/20" />
                <label htmlFor="featured" className="text-sm text-surface-300">Featured Vehicle</label>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-surface-800">
                <button type="button" onClick={handleCloseModal} disabled={submitting} className="btn-secondary text-sm disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-50">{submitting ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Confirm Delete</h3>
              <p className="text-surface-400 mb-6 text-sm">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteConfirm(null)} disabled={submitting} className="btn-secondary text-sm disabled:opacity-50">Cancel</button>
                <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} disabled={submitting} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50">{submitting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
