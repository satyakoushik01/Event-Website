const colors = {
  purple: 'bg-white/10 text-charcoal border-white/20 backdrop-blur-md',
  gold: 'bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30',
  green: 'bg-deep-emerald/10 text-deep-emerald border-deep-emerald/20',
  red: 'bg-red-900/10 text-red-700 border-red-900/20',
  gray: 'bg-black/5 text-gray-500 border-black/10',
  yellow: 'bg-amber-900/10 text-amber-700 border-amber-900/20',
};

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold border shadow-sm ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
