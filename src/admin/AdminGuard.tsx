import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect, useState, useCallback } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdmin = useCallback(async (userId: string) => {
    try {
      const { data, error: queryError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (queryError) {
        console.error('Admin check error:', queryError);
        setError(queryError.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (err) {
      console.error('Admin check exception:', err);
      setError('Failed to verify admin status');
      setIsAdmin(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setChecking(false);
      setIsAdmin(false);
      return;
    }

    checkAdmin(user.id);
  }, [user, authLoading, checkAdmin]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
        <p className="text-surface-500 text-sm font-mono">verifying_admin_access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm">
          {error}
        </div>
        <button
          onClick={() => { setChecking(true); setError(null); user && checkAdmin(user.id); }}
          className="text-sm text-surface-400 hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
