import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSafe } from '@/hooks/useAuth';
import type { UserProfile } from '@/context/AuthContext';
import { canAccessFeature } from '@/utils/roleCheck';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSubscription?: 'free' | 'pro' | 'premium';
  requiredProfileType?: Array<'buyer' | 'seller' | 'both'>;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredSubscription = 'free',
  requiredProfileType,
  fallbackPath = '/login',
}) => {
  const auth = useAuthSafe();

  // Still loading
  if (auth?.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!auth?.user || !auth?.userProfile) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check subscription tier
  if (!canAccessFeature(auth.userProfile.subscription_tier, requiredSubscription)) {
    return <Navigate to="/upgrade" replace />;
  }

  // Check profile type
  if (requiredProfileType && requiredProfileType.length > 0) {
    if (!requiredProfileType.includes(auth.userProfile.profile_type)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

/**
 * Wrapper component for optional authentication
 * Shows loading state while auth is initializing
 */
export const OptionalAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthSafe();

  if (auth?.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
