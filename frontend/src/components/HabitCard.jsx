import { useState } from 'react';

export default function HabitCard({ habit, onComplete, onEdit, onDelete, type = 'good' }) {
  const [showModal, setShowModal] = useState(false);
  const isGood = type === 'good';
  const canComplete = isGood ? !habit.completedToday : true;

  const handleComplete = () => {
    if (canComplete) onComplete?.(habit.id);
  };

  return (
    <>
      <div className="bg-quest-card/80 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-200">
        <div className="flex justify-between items-start">
          <h3 className="font-game text-lg text-slate-100">{habit.name}</h3>
          <span className={`text-sm font-semibold ${isGood ? 'text-green-400' : 'text-red-400'}`}>
            {isGood ? `+${habit.xpReward} XP` : `-${habit.xpPenalty} XP`}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          {canComplete && (
            <button
              onClick={handleComplete}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                isGood
                  ? 'bg-green-600/80 hover:bg-green-500 text-white'
                  : 'bg-red-600/80 hover:bg-red-500 text-white'
              }`}
            >
              {isGood ? (habit.completedToday ? '✓ Done' : 'Complete Today') : 'Violated'}
            </button>
          )}
          {isGood && habit.completedToday && (
            <span className="flex-1 py-2 text-center text-green-400 font-semibold">✓ Completed</span>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-3 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-300"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete?.(habit.id)}
            className="py-2 px-3 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-300"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      {showModal && (
        <HabitEditModal
          habit={habit}
          type={type}
          onSave={(data) => { onEdit?.(habit.id, data); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function HabitEditModal({ habit, type, onSave, onClose }) {
  const [name, setName] = useState(habit.name);
  const [xpValue, setXpValue] = useState(type === 'good' ? habit.xpReward : habit.xpPenalty);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-quest-card rounded-xl p-6 max-w-md w-full border border-slate-600">
        <h3 className="font-game text-xl mb-4">Edit {type === 'good' ? 'Good' : 'Bad'} Habit</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-3"
        />
        <label className="block text-sm text-slate-400 mb-1">
          XP {type === 'good' ? 'Reward' : 'Penalty'}
        </label>
        <input
          type="number"
          min="1"
          value={xpValue}
          onChange={(e) => setXpValue(parseInt(e.target.value) || 1)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSave({ name, xpReward: type === 'good' ? xpValue : undefined, xpPenalty: type === 'bad' ? xpValue : undefined })}
            className="flex-1 py-2 rounded-lg bg-quest-accent hover:bg-blue-500 font-semibold"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-slate-600 hover:bg-slate-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
