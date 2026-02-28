import { useState, useEffect } from 'react';
import { rewardsAPI } from '../api/api';
import RewardCard from './RewardCard';

export default function RewardShopSection({ dashboard, onDataChange }) {
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [xpCost, setXpCost] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRewards();
    loadHistory();
  }, []);

  const loadRewards = () => {
    rewardsAPI.getAll().then(({ data }) => setRewards(data));
  };

  const loadHistory = () => {
    rewardsAPI.getHistory(10).then(({ data }) => setHistory(data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await rewardsAPI.create({ name, xpCost });
      setName('');
      setXpCost(100);
      setShowForm(false);
      loadRewards();
      onDataChange?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    try {
      await rewardsAPI.purchase(id);
      loadRewards();
      loadHistory();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await rewardsAPI.update(id, data);
      loadRewards();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reward?')) return;
    try {
      await rewardsAPI.delete(id);
      loadRewards();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const userXP = dashboard?.xp ?? 0;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-game text-xl text-amber-400">🏪 Reward Shop</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500 font-semibold text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Reward'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-quest-card/60 rounded-xl border border-slate-700/50">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Reward name"
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-2"
            required
          />
          <div className="flex gap-2 items-center">
            <label className="text-slate-400 text-sm">XP Cost:</label>
            <input
              type="number"
              min="1"
              value={xpCost}
              onChange={(e) => setXpCost(parseInt(e.target.value) || 1)}
              className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100"
            />
            <button type="submit" disabled={loading} className="ml-auto px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 mb-6">
        {rewards.length === 0 && !showForm && (
          <p className="text-slate-500 text-center py-8">No rewards yet. Create custom rewards to spend XP on!</p>
        )}
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userXP={userXP}
            onPurchase={handlePurchase}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="font-game text-sm text-slate-500 mb-2">Recent Purchases</h4>
          <div className="space-y-1">
            {history.map((p) => (
              <div key={p.id} className="flex justify-between text-sm text-slate-400 py-1">
                <span>{p.rewardName}</span>
                <span className="text-amber-500/80">-{p.xpCost} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
