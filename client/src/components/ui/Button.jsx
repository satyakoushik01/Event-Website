import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-matte-black text-white hover:bg-charcoal cinematic-shadow border border-transparent',
  gold: 'gold-gradient text-matte-black hover:opacity-90 cinematic-glow border border-transparent',
  outline: 'border border-matte-black/20 text-matte-black hover:bg-matte-black hover:text-white',
  ghost: 'text-charcoal hover:bg-black/5 hover:text-matte-black',
  danger: 'bg-red-900/10 text-red-700 hover:bg-red-900/20 border border-red-900/10',
};

const sizes = {
  sm: 'px-5 py-2 text-xs uppercase tracking-widest',
  md: 'px-7 py-3 text-sm tracking-wide',
  lg: 'px-10 py-4 text-base tracking-wide',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  onClick,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Subtle shine effect on hover for primary/gold variants */}
      {['primary', 'gold'].includes(variant) && (
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          whileHover={{ translateX: '100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}
