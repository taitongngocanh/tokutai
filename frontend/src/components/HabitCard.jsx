import { useState } from 'react';
import { Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HabitCard({ habit, onComplete, onEdit, onDelete, type = 'good' }) {
  const [showModal, setShowModal] = useState(false);
  const isGood = type === 'good';
  const canComplete = isGood ? !habit.completedToday : true;

  const handleComplete = () => {
    if (canComplete) onComplete?.(habit.id);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-surface-200 hover:border-brand-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-surface-900 leading-tight">{habit.name}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isGood ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700'}`}>
            {isGood ? `+${habit.xpReward} XP` : `-${habit.xpPenalty} XP`}
          </span>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          {canComplete && (
            <button
              onClick={handleComplete}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-1.5 ${
                isGood
                  ? 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {isGood ? <><CheckCircle2 size={16} /> <span>Complete</span></> : <><AlertCircle size={16} /> <span>Violated</span></>}
            </button>
          )}
          {isGood && habit.completedToday && (
            <div className="flex-1 py-1.5 flex items-center justify-center space-x-1.5 text-brand-600 bg-brand-50 border border-brand-100 rounded-lg font-medium text-sm">
              <CheckCircle2 size={16} />
              <span>Done</span>
            </div>
          )}
          
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 mx-1 rounded-md text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete?.(habit.id)}
              className="p-1.5 rounded-md text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
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
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-surface-200 shadow-xl">
        <h3 className="font-semibold text-lg text-surface-900 mb-4">Edit {type === 'good' ? 'Habit' : 'Bad Habit'}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name"
              className="w-full px-3 py-2 rounded-lg bg-white border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-shadow"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              XP {type === 'good' ? 'Reward' : 'Penalty'}
            </label>
            <input
              type="number"
              min="1"
              value={xpValue}
              onChange={(e) => setXpValue(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-shadow"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave({ name, xpReward: type === 'good' ? xpValue : undefined, xpPenalty: type === 'bad' ? xpValue : undefined })}
            className="flex-1 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
