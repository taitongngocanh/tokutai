import { useState, useEffect } from 'react';
import { rewardsAPI } from '../api/api';
import RewardCard from './RewardCard';
import { Gift, Plus } from 'lucide-react';

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
        <h3 className="font-bold text-lg text-surface-900 flex items-center">
          <Gift size={20} className="mr-2 text-purple-500" /> Reward Shop
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-medium transition-colors border border-purple-200"
        >
          <Plus size={16} />
          <span>{showForm ? 'Cancel' : 'New Reward'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-white rounded-xl border border-surface-200 shadow-sm">
          {error && <p className="text-red-500 text-sm mb-3 font-medium bg-red-50 p-2 rounded">{error}</p>}
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What reward do you want to add?"
                className="w-full px-3 py-2 rounded-lg bg-surface-50 border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                required
              />
            </div>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-surface-600 text-sm font-medium">Cost (XP)</label>
                <input
                  type="number"
                  min="1"
                  value={xpCost}
                  onChange={(e) => setXpCost(parseInt(e.target.value) || 100)}
                  className="w-20 px-2 py-1.5 rounded-lg bg-surface-50 border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors text-sm">
                {loading ? 'Saving...' : 'Save Reward'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {rewards.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-surface-300">
            <Gift size={32} className="mx-auto text-surface-300 mb-2" />
            <p className="text-surface-500 font-medium">No rewards available.</p>
            <p className="text-surface-400 text-sm">Create rewards to motivate yourself!</p>
          </div>
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
        <div className="bg-white rounded-xl border border-surface-200 p-4 shadow-sm">
          <h4 className="font-semibold text-sm text-surface-700 mb-3 border-b border-surface-100 pb-2">Recent Redemptions</h4>
          <div className="space-y-2">
            {history.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-sm py-1">
                <span className="text-surface-600 font-medium">{p.rewardName}</span>
                <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full">-{p.xpCost} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
