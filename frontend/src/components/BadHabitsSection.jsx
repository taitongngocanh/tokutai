import { useState, useEffect } from 'react';
import { badHabitsAPI } from '../api/api';
import HabitCard from './HabitCard';

export default function BadHabitsSection({ onDataChange }) {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [xpPenalty, setXpPenalty] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    badHabitsAPI.getAll().then(({ data }) => setHabits(data));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await badHabitsAPI.create({ name, xpPenalty });
      setName('');
      setXpPenalty(30);
      setShowForm(false);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handleViolate = async (id) => {
    try {
      await badHabitsAPI.violate(id);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record');
    }
  };

  const handleEdit = async (id, data) => {
    try {
      await badHabitsAPI.update(id, { name: data.name, xpPenalty: data.xpPenalty || 30 });
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await badHabitsAPI.delete(id);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-game text-xl text-red-400">⚠️ Bad Habits</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 font-semibold text-sm"
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
            <label className="text-slate-400 text-sm">XP Penalty:</label>
            <input
              type="number"
              min="1"
              value={xpPenalty}
              onChange={(e) => setXpPenalty(parseInt(e.target.value) || 30)}
              className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100"
            />
            <button type="submit" disabled={loading} className="ml-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {habits.length === 0 && !showForm && (
          <p className="text-slate-500 text-center py-8">No bad habits tracked. Stay strong!</p>
        )}
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            type="bad"
            onComplete={handleViolate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}
