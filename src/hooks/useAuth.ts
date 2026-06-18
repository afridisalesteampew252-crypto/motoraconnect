import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to use authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to safely access auth context (returns undefined if outside provider)
 */
export function useAuthSafe() {
  return useContext(AuthContext);
}
