import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, glass = true, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? { 
        whileHover: { y: -8, scale: 1.01 }, 
        transition: { type: "spring", stiffness: 300, damping: 20 } 
      }
    : {};

  const baseStyle = glass 
    ? "glass-panel cinematic-shadow rounded-2xl overflow-hidden relative group" 
    : "bg-white rounded-2xl cinematic-shadow border border-gray-100 overflow-hidden relative group";

  return (
    <Component
      className={`${baseStyle} ${className}`}
      {...hoverProps}
      {...props}
    >
      {/* Subtle hover gradient reflection */}
      {hover && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </Component>
  );
}
