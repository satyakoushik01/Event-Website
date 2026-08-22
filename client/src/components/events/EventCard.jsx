import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PLACEHOLDER_EVENT_IMAGE } from '../../constants/images';

export default function EventCard({ event, index = 0 }) {
  const imageUrl = event.coverImage?.url || PLACEHOLDER_EVENT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/events/${event._id}`} className="block h-full group">
        <div className="relative h-[350px] w-full overflow-hidden rounded-2xl mb-4 cinematic-shadow">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {event.featured && (
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest text-matte-black bg-champagne-gold backdrop-blur-md rounded-full font-semibold shadow-lg">
                Exclusive
              </span>
            )}
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest text-white bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/10">
              {event.category}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="font-display text-2xl text-white mb-2 line-clamp-2 group-hover:text-champagne-gold transition-colors duration-500">
              {event.title}
            </h3>
            <div className="w-0 h-[1px] bg-champagne-gold group-hover:w-12 transition-all duration-700 ease-out mb-3" />
            <p className="text-sm text-white/70 line-clamp-2 font-light">
              {event.description}
            </p>
          </div>
        </div>
        <div className="px-2 flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-gray-400">{event.location?.city || 'Global'}</span>
          {event.budget?.min > 0 && (
            <span className="text-sm font-medium text-matte-black">
              ₹{event.budget.min.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
