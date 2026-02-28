import { useEffect, useState } from 'react';

function getRankColor(rank) {
  switch (rank) {
    case 'Bronze': return 'from-amber-700 to-amber-900';
    case 'Gold': return 'from-yellow-500 to-amber-600';
    case 'Diamond': return 'from-cyan-300 to-blue-500';
    default: return 'from-quest-accent to-blue-600';
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
      <div className="flex justify-between text-sm mb-1">
        <span className="font-game text-quest-accent">XP Progress</span>
        <span className="text-slate-400">{displayProgress}%</span>
      </div>
      <div className="h-4 bg-quest-card rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full bg-gradient-to-r ${getRankColor(rank)} xp-bar-fill rounded-full`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
