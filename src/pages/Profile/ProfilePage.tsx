import React, { useState, useEffect } from 'react';
import { useAuthSafe } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import { User, Mail, Shield, Save, Car, DollarSign, MapPin } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const auth = useAuthSafe();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [buyerPrefs, setBuyerPrefs] = useState<any>({
    preferred_makes: [],
    min_price: 0,
    max_price: 50000,
    min_year: 2015,
    preferred_body_types: []
  });

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchProfileData = async () => {
      try {
        // Fetch base profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', auth.user!.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch buyer preferences if applicable
        if (profileData.profile_type === 'buyer' || profileData.profile_type === 'both') {
          const { data: prefsData, error: prefsError } = await supabase
            .from('buyer_profiles')
            .select('*')
            .eq('user_id', auth.user!.id)
            .single();
          
          if (prefsData) {
            setBuyerPrefs(prefsData);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [auth?.user?.id]);

  const handleSave = async () => {
    if (!auth?.user?.id || saving) return;
    setSaving(true);
    try {
      // Update base profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: profile.full_name })
        .eq('id', auth.user.id);
      
      if (profileError) throw profileError;

      // Update buyer preferences
      if (profile.profile_type === 'buyer' || profile.profile_type === 'both') {
        const { error: prefsError } = await supabase
          .from('buyer_profiles')
          .upsert({
            user_id: auth.user.id,
            ...buyerPrefs
          });
        if (prefsError) throw prefsError;
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your profile information and vehicle preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Basic Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    value={profile?.email || ''}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {profile?.profile_type}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  {profile?.subscription_tier} Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Preferences (Conditional) */}
        {(profile?.profile_type === 'buyer' || profile?.profile_type === 'both') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Car className="mr-2 h-5 w-5 text-blue-600" />
                Matching Preferences
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (USD)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={buyerPrefs.min_price}
                      onChange={(e) => setBuyerPrefs({ ...buyerPrefs, min_price: parseInt(e.target.value) })}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={buyerPrefs.max_price}
                      onChange={(e) => setBuyerPrefs({ ...buyerPrefs, max_price: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Year</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={buyerPrefs.min_year}
                    onChange={(e) => setBuyerPrefs({ ...buyerPrefs, min_year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Brands (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Toyota, Honda, BMW..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={Array.isArray(buyerPrefs.preferred_makes) ? buyerPrefs.preferred_makes.join(', ') : ''}
                  onChange={(e) => setBuyerPrefs({ ...buyerPrefs, preferred_makes: e.target.value.split(',').map((s: string) => s.trim()) })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center px-6 py-3 rounded-xl font-bold text-white transition-all ${
              saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
            }`}
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
