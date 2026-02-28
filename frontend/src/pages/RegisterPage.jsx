import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register({ username, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-game text-4xl text-quest-accent mb-2">HABIT QUEST</h1>
          <p className="text-slate-400">Start your journey</p>
        </div>
        <div className="bg-quest-card/90 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          <h2 className="font-game text-xl mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 border border-red-700/50 text-red-300 text-sm">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Username (min 3 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-quest-accent focus:border-transparent"
              required
              minLength={3}
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-quest-accent focus:border-transparent"
              required
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-quest-accent focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 font-game font-semibold text-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-quest-accent hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
