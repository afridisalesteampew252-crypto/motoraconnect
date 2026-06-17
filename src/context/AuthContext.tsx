import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import type { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['users']['Row'];
export type UserSubscription = Database['public']['Tables']['subscriptions']['Row'];

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName: string, profileType: 'buyer' | 'seller' | 'both') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile and subscription
  const loadUserData = useCallback(async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setUserProfile(profile);

      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subError && subError.code !== 'PGRST116') throw subError; // PGRST116 = no rows found
      setSubscription(sub || null);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        if (authUser) {
          await loadUserData(authUser.id);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize auth');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setUserProfile(null);
          setSubscription(null);
        }
      }
    );

    return () => {
      authSubscription?.unsubscribe();
    };
  }, [loadUserData]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string, profileType: 'buyer' | 'seller' | 'both') => {
      setError(null);
      try {
        // Sign up with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('Failed to create user');

        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          profile_type: profileType,
          subscription_tier: 'free',
          is_active: true,
        });

        if (profileError) throw profileError;

        // Create free subscription
        const { error: subError } = await supabase.from('subscriptions').insert({
          user_id: data.user.id,
          status: 'active',
        });

        if (subError) throw subError;

        setUser(data.user);
        await loadUserData(data.user.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        setError(message);
        throw err;
      }
    },
    [loadUserData]
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('Failed to sign in');

      setUser(data.user);
      await loadUserData(data.user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  }, [loadUserData]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      setUser(null);
      setUserProfile(null);
      setSubscription(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setError(null);
      if (!user) throw new Error('No user logged in');

      try {
        const { error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id);

        if (updateError) throw updateError;
        await loadUserData(user.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Profile update failed';
        setError(message);
        throw err;
      }
    },
    [user, loadUserData]
  );

  const refreshUserData = useCallback(async () => {
    if (!user) return;
    await loadUserData(user.id);
  }, [user, loadUserData]);

  const value: AuthContextType = {
    user,
    userProfile,
    subscription,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
