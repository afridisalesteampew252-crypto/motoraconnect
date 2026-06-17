import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Export utility functions

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
}

/**
 * Sign in a user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get subscription status for a user
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

/**
 * Get user's vehicles
 */
export async function getUserVehicles(userId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * Get seller profile
 */
export async function getSellerProfile(userId: string) {
  const { data, error } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

/**
 * Get buyer profile
 */
export async function getBuyerProfile(userId: string) {
  const { data, error } = await supabase
    .from('buyer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

/**
 * Get user's matches
 */
export async function getUserMatches(userId: string, userType: 'buyer' | 'seller') {
  const column = userType === 'buyer' ? 'buyer_id' : 'seller_id';
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * Get user's transactions
 */
export async function getUserTransactions(
  userId: string,
  userType: 'buyer' | 'seller'
) {
  const column = userType === 'buyer' ? 'buyer_id' : 'seller_id';
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false });
  return { data, error };
}
