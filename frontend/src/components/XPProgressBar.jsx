import { useEffect, useState } from 'react';

function getRankColor(rank) {
  switch (rank) {
    case 'Bronze': return 'from-amber-500 to-amber-700';
    case 'Gold': return 'from-yellow-400 to-yellow-600';
    case 'Diamond': return 'from-blue-400 to-blue-600';
    default: return 'from-brand-400 to-brand-600';
  }
}

export default function XPProgressBar({ xpProgress = 0, rank = 'Bronze', animated = true }) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayProgress(xpProgress), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(xpProgress);
    }
  }, [xpProgress, animated]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1.5 font-medium">
        <span className="text-surface-600">Progress</span>
        <span className="text-surface-700">{displayProgress}%</span>
      </div>
      <div className="h-3 bg-surface-200 rounded-full overflow-hidden border border-surface-300">
        <div
          className={`h-full bg-gradient-to-r ${getRankColor(rank)} xp-bar-fill rounded-full`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
