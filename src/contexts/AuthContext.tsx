import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('Auth session fetch timeout - forcing loading false');
        setLoading(false);
        loadingRef.current = false;
      }
    }, 8000);

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      clearTimeout(timeoutId);
      if (error) console.error('Session fetch error:', error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      loadingRef.current = false;
    }).catch((err) => {
      if (!mounted) return;
      clearTimeout(timeoutId);
      console.error('Session fetch exception:', err);
      setLoading(false);
      loadingRef.current = false;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      loadingRef.current = false;
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    // Input validation
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }
    if (!email.includes('@') || email.length > 254) {
      return { error: 'Please enter a valid email address' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signUp(email: string, password: string, fullName: string) {
    // Input validation
    if (!email || !password || !fullName) {
      return { error: 'All fields are required' };
    }
    if (!email.includes('@') || email.length > 254) {
      return { error: 'Please enter a valid email address' };
    }
    if (password.length < 8) {
      return { error: 'Password must be at least 8 characters' };
    }
    if (fullName.trim().length < 2 || fullName.length > 100) {
      return { error: 'Please enter a valid name' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) return { error: error.message };

    // If signup successful, ensure profile is created (Supabase triggers usually handle this, but we can be explicit)
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          profile_type: 'buyer', // Default to buyer
          subscription_tier: 'free'
        });
      
      if (profileError) console.error('Profile creation error:', profileError);
    }

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
