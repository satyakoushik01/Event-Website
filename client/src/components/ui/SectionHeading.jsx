import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`text-center mb-16 max-w-2xl mx-auto ${className}`}
    >
      <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-matte-black mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm tracking-wide font-light">
          {subtitle}
        </p>
      )}
      <div className="w-12 h-[1px] bg-champagne-gold mx-auto mt-8" />
    </motion.div>
  );
}
