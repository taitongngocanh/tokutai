import { useState, useEffect } from 'react';
import { badHabitsAPI } from '../api/api';
import HabitCard from './HabitCard';
import { Plus, AlertTriangle } from 'lucide-react';

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
      alert(err.response?.data?.message || 'Failed to record violation');
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
    if (!confirm('Delete this bad habit?')) return;
    try {
      await badHabitsAPI.delete(id);
      loadHabits();
      onDataChange?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-surface-900 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-red-500" /> Bad Habits
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium transition-colors border border-red-200"
        >
          <Plus size={16} />
          <span>{showForm ? 'Cancel' : 'New Habit'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 p-4 bg-white rounded-xl border border-surface-200 shadow-sm">
          {error && <p className="text-red-500 text-sm mb-3 font-medium bg-red-50 p-2 rounded">{error}</p>}
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What habit do you want to break?"
                className="w-full px-3 py-2 rounded-lg bg-surface-50 border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                required
              />
            </div>
            <div className="flex gap-3 items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-surface-600 text-sm font-medium">XP Penalty</label>
                <input
                  type="number"
                  min="1"
                  value={xpPenalty}
                  onChange={(e) => setXpPenalty(parseInt(e.target.value) || 30)}
                  className="w-20 px-2 py-1.5 rounded-lg bg-surface-50 border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm">
                {loading ? 'Saving...' : 'Save Habit'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {habits.length === 0 && !showForm && (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-surface-300">
            <AlertTriangle size={32} className="mx-auto text-surface-300 mb-2" />
            <p className="text-surface-500 font-medium">No bad habits to break.</p>
            <p className="text-surface-400 text-sm">Keep up the good work!</p>
          </div>
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
