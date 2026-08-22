import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEvents } from '../api/events';
import EventCard from '../components/events/EventCard';
import Loader from '../components/ui/Loader';
import { EVENT_CATEGORIES } from '../constants/categories';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;

    getEvents(params)
      .then(({ data }) => {
        setEvents(data.events || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch(() => setError('Unable to load events.'))
      .finally(() => setLoading(false));
  }, [category, page]);

  const setCategory = (cat) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="bg-warm-white min-h-screen pb-32">
      <section className="pt-40 pb-20 px-6 lg:px-8 border-b border-gray-200 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-6 block">The Portfolio</span>
          <h1 className="font-display text-5xl md:text-7xl mb-6 text-matte-black tracking-tight">Curated Experiences</h1>
          <p className="text-gray-500 font-light tracking-wide text-lg max-w-2xl mx-auto">
            Explore our collection of meticulously designed event packages and draw inspiration for your own bespoke celebration.
          </p>
        </motion.div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Pill navigation */}
          <div className="flex flex-wrap gap-4 mb-16 justify-center">
            <button
              onClick={() => setCategory('')}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 ${!category ? 'bg-matte-black text-white' : 'bg-transparent border border-gray-300 text-gray-500 hover:border-matte-black hover:text-matte-black'}`}
            >
              All Events
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-300 ${category === cat ? 'bg-matte-black text-white' : 'bg-transparent border border-gray-300 text-gray-500 hover:border-matte-black hover:text-matte-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
            <span className="text-sm font-light text-gray-500">{total} {total === 1 ? 'Experience' : 'Experiences'} Available</span>
          </div>

          {error && (
            <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          {loading ? (
            <Loader className="py-32" />
          ) : events.length === 0 ? (
            <div className="py-32 text-center text-gray-400 font-light">
              <p className="text-2xl mb-2">No experiences found</p>
              <p className="text-sm">Please explore a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {events.map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          )}

          {/* Minimal Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-24">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', String(p));
                    setSearchParams(params);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-light transition-all duration-300 ${p === page ? 'bg-matte-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
