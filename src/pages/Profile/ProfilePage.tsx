import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Mail, Save, Car, Terminal } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [buyerPrefs, setBuyerPrefs] = useState({
    preferred_makes: [] as string[],
    min_price: 0,
    max_price: 50000,
    min_year: 2015,
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfileData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        setProfile(profileData);

        if (profileData) {
          const { data: prefsData } = await supabase
            .from('buyers')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (prefsData) {
            setBuyerPrefs({
              preferred_makes: prefsData.preferred_vehicles || [],
              min_price: prefsData.budget_min || 0,
              max_price: prefsData.budget_max || 50000,
              min_year: 2015,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id || saving) return;
    setSaving(true);
    try {
      if (profile) {
        await supabase
          .from('users')
          .update({ full_name: profile.full_name })
          .eq('id', user.id);
      }

      await supabase
        .from('buyers')
        .upsert({
          user_id: user.id,
          preferred_vehicles: buyerPrefs.preferred_makes,
          budget_min: buyerPrefs.min_price,
          budget_max: buyerPrefs.max_price,
        }, { onConflict: 'user_id' });

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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-surface-500 font-mono text-sm">loading_profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono text-sm">// profile</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Account Settings</h1>
        <p className="text-surface-400 mb-8">Manage your profile information and vehicle preferences.</p>

        <div className="space-y-4">
          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-800">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="mr-2 h-5 w-5 text-emerald-400" />
                Basic Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-field">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
                    <input
                      type="email"
                      disabled
                      className="input-field pl-10 bg-surface-800 text-surface-500 cursor-not-allowed"
                      value={user?.email || ''}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="label-field">Account Type</label>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {profile?.profile_type || 'buyer'}
                  </span>
                  <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {profile?.subscription_tier || 'free'} member
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-900/50 border border-surface-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-800">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Car className="mr-2 h-5 w-5 text-emerald-400" />
                Matching Preferences
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label-field">Price Range (USD)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input-field"
                      value={buyerPrefs.min_price}
                      onChange={(e) => setBuyerPrefs({ ...buyerPrefs, min_price: parseInt(e.target.value) || 0 })}
                    />
                    <span className="text-surface-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="input-field"
                      value={buyerPrefs.max_price}
                      onChange={(e) => setBuyerPrefs({ ...buyerPrefs, max_price: parseInt(e.target.value) || 50000 })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field">Minimum Year</label>
                  <input
                    type="number"
                    className="input-field"
                    value={buyerPrefs.min_year}
                    onChange={(e) => setBuyerPrefs({ ...buyerPrefs, min_year: parseInt(e.target.value) || 2015 })}
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Preferred Brands (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Toyota, Honda, BMW..."
                  className="input-field"
                  value={buyerPrefs.preferred_makes.join(', ')}
                  onChange={(e) => setBuyerPrefs({ ...buyerPrefs, preferred_makes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-surface-900/30 border-t-surface-900 rounded-full" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
