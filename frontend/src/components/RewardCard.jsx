import { useState } from 'react';
import { Pencil, Trash2, ShoppingBag } from 'lucide-react';

export default function RewardCard({ reward, userXP, onPurchase, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const canAfford = userXP >= reward.xpCost;

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-surface-200 flex flex-col justify-between group hover:border-purple-300 hover:shadow-sm transition-all duration-200 h-full">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-surface-900 leading-tight">{reward.name}</h3>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className="p-1 rounded text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete?.(reward.id)}
                className="p-1 rounded text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700 inline-block">
            {reward.xpCost} XP
          </span>
        </div>
        
        <button
          onClick={() => onPurchase?.(reward.id)}
          disabled={!canAfford}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center space-x-2 ${
            canAfford
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow'
              : 'bg-surface-100 text-surface-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag size={16} />
          <span>{canAfford ? 'Redeem' : 'Not enough XP'}</span>
        </button>
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
    <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-surface-200 shadow-xl">
        <h3 className="font-semibold text-lg text-surface-900 mb-4">Edit Reward</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Reward name"
              className="w-full px-3 py-2 rounded-lg bg-white border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-shadow"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Cost (XP)</label>
            <input
              type="number"
              min="1"
              value={xpCost}
              onChange={(e) => setXpCost(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-surface-300 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-shadow"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave({ name, xpCost })}
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
