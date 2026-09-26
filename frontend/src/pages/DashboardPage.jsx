import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../api/api';
import XPProgressBar from '../components/XPProgressBar';
import CharacterAvatar from '../components/CharacterAvatar';
import GoodHabitsSection from '../components/GoodHabitsSection';
import BadHabitsSection from '../components/BadHabitsSection';
import RewardShopSection from '../components/RewardShopSection';
import HeatmapDashboard from '../components/HeatmapDashboard';
import { LogOut, User, Activity, Zap, Award } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, refreshDashboard, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }
    if (user) loadDashboard();
  }, [user, loading]);

  const rankOrder = { Bronze: 0, Gold: 1, Diamond: 2 };

  const loadDashboard = () => {
    dashboardAPI.get().then(({ data }) => {
      setDashboard((prev) => {
        if (prev && prev.rank !== data.rank && (rankOrder[data.rank] ?? 0) > (rankOrder[prev.rank] ?? 0)) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        return data;
      });
    });
  };

  const handleDataChange = () => {
    refreshDashboard().then(setDashboard);
  };

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-surface-500 font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    if (rank === 'Bronze') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (rank === 'Gold') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-500 text-white p-1.5 rounded-lg">
              <Activity size={20} />
            </div>
            <h1 className="font-bold text-xl text-surface-900 tracking-tight">Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 text-surface-600">
              <User size={16} />
              <span className="font-medium text-sm hidden sm:inline">{dashboard.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-surface-200 hover:bg-surface-100 text-surface-600 text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Heatmap Section - Main focus now */}
        <HeatmapDashboard onDataChange={handleDataChange} />

        {/* User Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <CharacterAvatar rank={dashboard.rank} />
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-surface-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-surface-900">{dashboard.username}</h2>
                  <p className="text-surface-500 text-sm flex items-center mt-1">
                    <Award size={14} className="mr-1" /> {dashboard.totalCompletedHabits} habits completed
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-sm font-bold flex items-center shadow-sm ${getRankColor(dashboard.rank)}`}>
                  <Zap size={14} className="mr-1" />
                  {dashboard.rank} Rank
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xl font-bold text-brand-600">{dashboard.xp} <span className="text-sm font-medium text-surface-500">XP</span></div>
                  <div className="text-xs font-medium text-surface-500">Next rank: {dashboard.xpForNextRank} XP</div>
                </div>
                <XPProgressBar xpProgress={dashboard.xpProgress} rank={dashboard.rank} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GoodHabitsSection onDataChange={handleDataChange} />
          <BadHabitsSection onDataChange={handleDataChange} />
        </div>
        
        <RewardShopSection dashboard={dashboard} onDataChange={handleDataChange} />
      </main>
    </div>
  );
}
