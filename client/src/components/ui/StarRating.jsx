export default function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'text-base' : 'text-xs';
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-champagne-gold' : 'text-gray-200'}>
          ★
        </span>
      ))}
      {rating > 0 && (
        <span className="ml-1.5 text-gray-400 text-[10px] font-light tracking-wide">{rating?.toFixed(1)}</span>
      )}
    </div>
  );
}
