import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ClientStoryCard from "./ClientStoryCard";
import { CLIENT_STORIES } from '../data/clientStories';

export default function ClientStoriesCarousel({ stories }) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const autoSlideRef = useRef(null);

  const visibleCards = 4;
  const maxIndex = Math.max(0, stories.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCarouselIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCarouselIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(autoSlideRef.current);
      return;
    }
    autoSlideRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(autoSlideRef.current);
  }, [isPaused, nextSlide]);

  return (
    <section id="client-stories" className="py-32 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
  <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">{`VOICES`}</span>
  <h2 className="text-3xl font-bold mt-1 text-gray-900">Client Stories</h2>
  <p className="text-gray-600 mt-2">Reflecting on moments made timeless</p>
</div>
        <div className="relative">
          {/* Left Arrow */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-300 group" aria-label="Previous">
            <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          {/* Cards Track */}
          <div ref={carouselRef} className="overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => { setIsPaused(false); setHoveredCard(null); }}>
            <motion.div className="flex gap-6" animate={{ x: `calc(-${carouselIndex * (100 / visibleCards)}% - ${carouselIndex * 6}px)` }} transition={{ type: 'spring', stiffness: 280, damping: 32 }}>
              {stories.map(story => (
                <ClientStoryCard key={story.id} story={story} isHovered={hoveredCard === story.id} onHover={() => setHoveredCard(story.id)} onLeave={() => setHoveredCard(null)} />
              ))}
            </motion.div>
          </div>
          {/* Right Arrow */}
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-300 group" aria-label="Next">
            <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button key={i} onClick={() => setCarouselIndex(i)} className={`rounded-full transition-all duration-300 ${i === carouselIndex ? 'w-6 h-2 bg-matte-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        {/* View All */}
        <div className="text-center mt-10">
          <Link to="/client-stories">
            <button className="px-8 py-3 rounded-full bg-matte-black text-white text-sm font-medium tracking-wide hover:bg-charcoal transition-colors duration-300 shadow-sm">View All</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
