import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        throw err;
      }
      setVehicles(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
      setError(message);
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        body_type: vehicle.body_type,
        engine_cc: vehicle.engine_cc,
        transmission: vehicle.transmission,
        fuel_type: vehicle.fuel_type,
        drive_type: vehicle.drive_type,
        mileage_km: vehicle.mileage_km,
        auction_grade: vehicle.auction_grade,
        estimated_price_jpy: vehicle.estimated_price_jpy,
        estimated_price_usd: vehicle.estimated_price_usd,
        image_url: vehicle.image_url,
        featured: vehicle.featured,
      });
    } else {
      setEditingId(null);
      setFormData(emptyFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        // Update vehicle
        const { error: err } = await supabase
          .from('vehicles')
          .update(formData)
          .eq('id', editingId);

        if (err) throw err;
        setToast({ message: 'Vehicle updated successfully', type: 'success' });
      } else {
        // Create vehicle
        const { error: err } = await supabase.from('vehicles').insert([formData]);

        if (err) throw err;
        setToast({ message: 'Vehicle created successfully', type: 'success' });
      }

      handleCloseModal();
      await fetchVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setToast({ message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg text-white font-semibold transition-opacity ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } z-50`}
          >
            {toast.message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No vehicles found</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Add the first vehicle
            </button>
          </div>
        ) : (
          /* Table Container */
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Make</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Body Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CC</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price (JPY)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price (USD)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Featured</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        {vehicle.image_url && (
                          <img
                            src={vehicle.image_url}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="h-12 w-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.year}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehicle.make}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.body_type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.engine_cc}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.auction_grade}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ¥{vehicle.estimated_price_jpy.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${vehicle.estimated_price_usd.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            vehicle.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {vehicle.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => handleOpenModal(vehicle)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(vehicle.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Make and Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Land Cruiser"
                  />
                </div>
              </div>

              {/* Year and Body Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Body Type</label>
                  <select
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>SUV</option>
                    <option>Sedan</option>
                    <option>Coupe</option>
                    <option>Pickup</option>
                    <option>Van</option>
                    <option>Hatchback</option>
                  </select>
                </div>
              </div>

              {/* Engine CC and Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Engine CC</label>
                  <input
                    type="number"
                    name="engine_cc"
                    value={formData.engine_cc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Transmission</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                    <option>CVT</option>
                  </select>
                </div>
              </div>

              {/* Fuel Type and Drive Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Type</label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Hybrid</option>
                    <option>Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Drive Type</label>
                  <select
                    name="drive_type"
                    value={formData.drive_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>FWD</option>
                    <option>RWD</option>
                    <option>AWD</option>
                    <option>4WD</option>
                  </select>
                </div>
              </div>

              {/* Mileage and Grade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    name="mileage_km"
                    value={formData.mileage_km}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Auction Grade</label>
                  <input
                    type="text"
                    name="auction_grade"
                    value={formData.auction_grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., A, B, C"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (JPY)</label>
                  <input
                    type="number"
                    name="estimated_price_jpy"
                    value={formData.estimated_price_jpy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    name="estimated_price_usd"
                    value={formData.estimated_price_usd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-semibold text-gray-700">
                  Featured Vehicle
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this vehicle? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
