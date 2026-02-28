import { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habit_quest_token');
    if (token) {
      dashboardAPI.get()
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('habit_quest_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('habit_quest_token', data.token);
    setUser({ username: data.username, xp: data.xp, rank: data.rank });
  };

  const logout = () => {
    localStorage.removeItem('habit_quest_token');
    setUser(null);
  };

  const refreshDashboard = () => {
    return dashboardAPI.get().then(({ data }) => {
      setUser(data);
      return data;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshDashboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
