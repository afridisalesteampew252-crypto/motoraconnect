import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  vehicle_interest: string;
  package_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  message: string;
  budget_range: string;
  created_at: string;
}

const ConsultationsAdminPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setConsultations(
        consultations.map((c) =>
          c.id === id
            ? { ...c, status: newStatus as Consultation['status'] }
            : c
        )
      );
    } catch (error) {
      console.error('Error updating consultation status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Consultations</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {consultations.length}
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Country
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Vehicle Interest
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <React.Fragment key={consultation.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      setExpandedId(
                        expandedId === consultation.id ? null : consultation.id
                      )
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {consultation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.phone}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.country}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.vehicle_interest}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.package_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={consultation.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(consultation.id, e.target.value);
                        }}
                        disabled={updatingId === consultation.id}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border-0 ${getStatusColor(
                          consultation.status
                        )} disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(consultation.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(
                            expandedId === consultation.id
                              ? null
                              : consultation.id
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedId === consultation.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === consultation.id && (
                    <tr className="bg-gray-50 border-b-2 border-blue-200">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              Message
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {consultation.message}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Budget Range
                              </h4>
                              <p className="text-gray-700">
                                {consultation.budget_range}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Submitted
                              </h4>
                              <p className="text-gray-700">
                                {new Date(
                                  consultation.created_at
                                ).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {consultations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No consultations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationsAdminPage;
