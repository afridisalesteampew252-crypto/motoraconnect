import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect to admin dashboard if already logged in
  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSigningIn(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setIsSigningIn(false);
    } else {
      // signIn was successful, navigation will happen via useAuth state change
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-surface-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface-800 rounded-2xl border border-surface-700 shadow-2xl p-8 sm:p-10">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Motoraconnect
            </h1>
            <p className="text-surface-400 text-sm">Admin Panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label-field text-surface-200">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isSigningIn}
                className="input-field bg-surface-700 border-surface-600 text-white placeholder:text-surface-500
                          focus:ring-brand-500/30 focus:border-brand-500
                          disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label-field text-surface-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSigningIn}
                className="input-field bg-surface-700 border-surface-600 text-white placeholder:text-surface-500
                          focus:ring-brand-500/30 focus:border-brand-500
                          disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSigningIn}
              className="btn-primary w-full mt-7 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-surface-700">
            <p className="text-center text-xs text-surface-500">
              This is a private admin panel for Motoraconnect staff only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
