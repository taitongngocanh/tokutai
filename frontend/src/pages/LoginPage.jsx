import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ username, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-game text-4xl text-quest-accent mb-2">HABIT QUEST</h1>
          <p className="text-slate-400">Level up your life</p>
        </div>
        <div className="bg-quest-card/90 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          <h2 className="font-game text-xl mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-900/50 border border-red-700/50 text-red-300 text-sm">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-quest-accent focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-quest-accent focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-quest-accent hover:bg-blue-500 font-game font-semibold text-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Loading...' : 'Enter Quest'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-400">
            No account?{' '}
            <Link to="/register" className="text-quest-accent hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
