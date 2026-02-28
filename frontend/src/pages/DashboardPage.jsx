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
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-game text-quest-accent text-xl animate-pulse">Loading your quest...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-quest-dark/95 backdrop-blur border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-game text-2xl text-quest-accent">HABIT QUEST</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{dashboard.username}</span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Card */}
        <div className="bg-quest-card/80 rounded-2xl p-6 border border-slate-700/50 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <CharacterAvatar rank={dashboard.rank} />
            <div className="flex-1 w-full">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <h2 className="font-game text-2xl text-slate-100">{dashboard.username}</h2>
                <span className={`font-game text-lg px-3 py-1 rounded-lg ${
                  dashboard.rank === 'Bronze' ? 'bg-amber-900/50 text-amber-300' :
                  dashboard.rank === 'Gold' ? 'bg-yellow-800/50 text-yellow-300' :
                  'bg-cyan-900/50 text-cyan-300'
                }`}>
                  {dashboard.rank}
                </span>
              </div>
              <div className="text-3xl font-game text-quest-accent mb-4">{dashboard.xp} XP</div>
              <XPProgressBar xpProgress={dashboard.xpProgress} rank={dashboard.rank} />
              <p className="text-slate-400 text-sm mt-2">
                {dashboard.totalCompletedHabits} habits completed · Next rank at {dashboard.xpForNextRank} XP
              </p>
            </div>
          </div>
        </div>

        <GoodHabitsSection onDataChange={handleDataChange} />
        <BadHabitsSection onDataChange={handleDataChange} />
        <RewardShopSection dashboard={dashboard} onDataChange={handleDataChange} />
      </main>
    </div>
  );
}
