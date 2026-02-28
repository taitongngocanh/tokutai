export default function CharacterAvatar({ rank = 'Bronze' }) {
  const getRankStyle = () => {
    switch (rank) {
      case 'Bronze': return 'ring-amber-600/60 bg-amber-900/30';
      case 'Gold': return 'ring-yellow-500/60 bg-amber-800/30';
      case 'Diamond': return 'ring-cyan-400/60 bg-blue-900/30';
      default: return 'ring-quest-accent/60 bg-slate-800/30';
    }
  };

  const getEmoji = () => {
    switch (rank) {
      case 'Bronze': return '🥉';
      case 'Gold': return '🥇';
      case 'Diamond': return '💎';
      default: return '🦸';
    }
  };

  return (
    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ring-4 ${getRankStyle()} transition-all duration-300`}>
      {getEmoji()}
    </div>
  );
}
