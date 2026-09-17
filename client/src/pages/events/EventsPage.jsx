import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import events from '../../mockData/events';

const posterImages = [
  "https://images.unsplash.com/photo-1540039155732-68473638c4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601002573216-953e34b3e75e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const EventCard = ({ event }) => {
  return (
    <div className="bg-white dark:bg-charcoal rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-white/10 group hover:border-amber-400/50 hover:shadow-md transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.images[0]} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {event.badge && (
          <div className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold tracking-wider rounded bg-matte-black/80 text-champagne-gold backdrop-blur-md border border-champagne-gold/20 uppercase">
            {event.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-display text-gray-900 dark:text-white mb-1">{event.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{event.date} • {event.time}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{event.location}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-amber-600 dark:text-amber-400 font-semibold">₹{event.price}</div>
          <Link 
            to={`/events/${event.id}`}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-matte-black text-white dark:bg-amber-400 dark:text-matte-black hover:bg-gray-800 dark:hover:bg-amber-300 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPosterIndex((prev) => (prev + 1) % posterImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);
  
  const filters = ['All', 'Festive Specials', 'Weekend Specials', 'Live Music', 'Comedy', 'Cultural', 'Family', 'Kids'];
  
  const festiveEvents = events.filter(e => e.category === 'Festive Specials');
  const weekendEvents = events.filter(e => e.category === 'Weekend Specials');
  
  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => e.category === activeFilter || e.tags?.includes(activeFilter));

  return (
    <div className="min-h-screen bg-warm-white text-gray-900 dark:bg-matte-black dark:text-white transition-colors duration-300 pt-20 pb-20">
      {/* Hero Section / Poster Banner */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 mt-8 mb-16">
        <div className="relative h-[320px] md:h-[360px] rounded-2xl overflow-hidden flex flex-col justify-center px-8 md:px-12">
          {/* Poster track container positioned absolutely behind header text */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentPosterIndex}
                src={posterImages[currentPosterIndex]} 
                alt="Event poster banner" 
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          </div>
          
          <div className="relative z-20 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">Ongoing Events</h1>
            <p className="text-xl text-amber-300 font-medium mb-2">Discover What's Happening</p>
            <p className="text-sm text-gray-200 mb-1">Explore and book amazing events, shows and experiences</p>
            <p className="text-sm text-gray-300">Curated for you by <span className="text-amber-300 font-semibold">MomentsHub</span>.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        
        {/* Festive Specials */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-amber-500">✨</span> Festive Specials
            </h2>
            <Link to="#" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {festiveEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Weekend Specials */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-amber-500">🎉</span> Weekend Specials
            </h2>
            <Link to="#" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekendEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* All Events & Shows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-amber-500">🎟️</span> All Events & Shows
            </h2>
            <Link to="#" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium">View All</Link>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  activeFilter === filter 
                    ? 'bg-matte-black text-white dark:bg-amber-400 dark:text-matte-black border-matte-black dark:border-amber-400' 
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-charcoal dark:text-gray-300 dark:border-white/10 hover:border-gray-900 dark:hover:border-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

