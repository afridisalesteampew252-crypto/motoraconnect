import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/context/AuthContext';

/**
 * Hook to use authentication context
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Hook to safely access auth context (returns undefined if outside provider)
 */
export const useAuthSafe = (): AuthContextType | undefined => {
  return useContext(AuthContext);
};
