import { useState, useEffect } from 'react';
import { goodHabitsAPI } from '../api/api';
import HabitCard from './HabitCard';

export default function GoodHabitsSection({ onDataChange }) {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [xpReward, setXpReward] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    goodHabitsAPI.getAll().then(({ data }) => setHabits(data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await goodHabitsAPI.create({ name, xpReward });
      setName('');
      setXpReward(50);
      setShowForm(false);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await goodHabitsAPI.complete(id);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete');
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await goodHabitsAPI.update(id, { name: data.name, xpReward: data.xpReward || 50 });
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await goodHabitsAPI.delete(id);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-game text-xl text-green-400">✨ Good Habits</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-green-600/80 hover:bg-green-500 font-semibold text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Habit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-quest-card/60 rounded-xl border border-slate-700/50">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name"
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-2"
            required
          />
          <div className="flex gap-2 items-center">
            <label className="text-slate-400 text-sm">XP Reward:</label>
            <input
              type="number"
              min="1"
              value={xpReward}
              onChange={(e) => setXpReward(parseInt(e.target.value) || 50)}
              className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100"
            />
            <button type="submit" disabled={loading} className="ml-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {habits.length === 0 && !showForm && (
          <p className="text-slate-500 text-center py-8">No good habits yet. Add one to start gaining XP!</p>
        )}
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            type="good"
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}
