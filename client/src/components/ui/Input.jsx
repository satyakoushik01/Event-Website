export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-widest font-medium text-gray-500 mb-2">{label}</label>
      )}
      <input
        className={`w-full px-5 py-3.5 rounded-none border-b bg-white/50 backdrop-blur-sm text-matte-black placeholder-gray-400 focus:outline-none focus:bg-white focus:border-champagne-gold transition-all duration-300 ${error ? 'border-red-400' : 'border-gray-200'} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-xs text-red-500 tracking-wide">{error}</p>}
    </div>
  );
}
