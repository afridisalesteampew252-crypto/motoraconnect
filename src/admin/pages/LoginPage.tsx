import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Terminal, LogIn } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

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
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-900/50 border border-surface-800 rounded-2xl p-8 sm:p-10 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Motoraconnect</h1>
            <p className="text-surface-500 text-sm font-mono">admin_panel.login()</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label-field">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@motoraconnect.com"
                required
                disabled={isSigningIn}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-field">
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
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="btn-primary w-full mt-7 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-800">
            <p className="text-center text-xs text-surface-600 font-mono">
              Private admin panel for Motoraconnect staff only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
