import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioLightbox({ images = [], initialIndex = 0, isOpen = false, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || images.length === 0) return null;

  const currentItem = images[currentIndex] || {};
  const currentUrl = currentItem.url || currentItem;
  const currentTitle = currentItem.title || 'Portfolio Showcase';
  const currentCategory = currentItem.category || '';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-matte-black/90 backdrop-blur-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close Lightbox"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Previous Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Next Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main Image Container */}
        <div className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
          <motion.img
            key={currentUrl}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            src={currentUrl}
            alt={currentTitle}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
          />

          {/* Caption */}
          <div className="mt-4 text-center">
            {currentCategory && (
              <span className="text-[10px] uppercase tracking-widest text-champagne-gold font-semibold block mb-1">
                {currentCategory}
              </span>
            )}
            <h4 className="font-display text-xl text-white font-light">{currentTitle}</h4>
            <span className="text-xs text-gray-400 font-light mt-1 block">
              {currentIndex + 1} of {images.length}
            </span>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
