import { useState } from 'react';

export default function RewardCard({ reward, userXP, onPurchase, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const canAfford = userXP >= reward.xpCost;

  const handlePurchase = () => {
    if (canAfford) onPurchase?.(reward.id);
  };

  return (
    <>
      <div className="bg-quest-card/80 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-200">
        <div className="flex justify-between items-start">
          <h3 className="font-game text-lg text-slate-100">{reward.name}</h3>
          <span className="text-amber-400 font-semibold">{reward.xpCost} XP</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handlePurchase}
            disabled={!canAfford}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
              canAfford
                ? 'bg-amber-600/80 hover:bg-amber-500 text-white'
                : 'bg-slate-600/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Buy' : 'Insufficient XP'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-3 rounded-lg bg-slate-600/50 hover:bg-slate-500/50 text-slate-300"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete?.(reward.id)}
            className="py-2 px-3 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-300"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      {showModal && (
        <RewardEditModal
          reward={reward}
          onSave={(data) => { onEdit?.(reward.id, data); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function RewardEditModal({ reward, onSave, onClose }) {
  const [name, setName] = useState(reward.name);
  const [xpCost, setXpCost] = useState(reward.xpCost);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-quest-card rounded-xl p-6 max-w-md w-full border border-slate-600">
        <h3 className="font-game text-xl mb-4">Edit Reward</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Reward name"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-3"
        />
        <label className="block text-sm text-slate-400 mb-1">XP Cost</label>
        <input
          type="number"
          min="1"
          value={xpCost}
          onChange={(e) => setXpCost(parseInt(e.target.value) || 1)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSave({ name, xpCost })}
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
