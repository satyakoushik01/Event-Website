import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEvent } from '../api/events';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import VendorCard from '../components/vendors/VendorCard';
import { PLACEHOLDER_EVENT_IMAGE } from '../constants/images';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEvent(id)
      .then(({ data }) => {
        setEvent(data.event);
        setError('');
      })
      .catch(() => setError('Unable to load event details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader className="min-h-screen" size="lg" />;
  if (error) return <div className="text-center py-40 text-red-500 font-light">{error}</div>;
  if (!event) return <div className="text-center py-40 text-gray-400 font-light">Event not found</div>;

  const coverUrl = event.coverImage?.url || PLACEHOLDER_EVENT_IMAGE;

  return (
    <div className="bg-warm-white">
      {/* Full viewport cinematic hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-matte-black">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={coverUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <Badge color="gold" className="mb-4">{event.category}</Badge>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight">
                {event.title}
              </h1>
              {event.location?.city && (
                <p className="text-white/60 font-light text-lg">
                  {event.location.city}, {event.location.state}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left: Description */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="font-display text-3xl mb-6 text-matte-black">About This Experience</h2>
              <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
              <p className="text-gray-600 leading-relaxed font-light text-lg">{event.description}</p>
            </section>

            {event.services?.length > 0 && (
              <section>
                <h2 className="font-display text-3xl mb-6 text-matte-black">Included Services</h2>
                <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
                <div className="flex flex-wrap gap-3">
                  {event.services.map((s) => (
                    <Badge key={s} color="gray" className="text-sm py-2 px-5">{s}</Badge>
                  ))}
                </div>
              </section>
            )}

            {event.vendors?.length > 0 && (
              <section>
                <h2 className="font-display text-3xl mb-6 text-matte-black">Curated Artisans</h2>
                <div className="w-12 h-[1px] bg-champagne-gold mb-10" />
                <div className="grid sm:grid-cols-2 gap-8">
                  {event.vendors.map((v, i) => (
                    <VendorCard key={v._id} vendor={v} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Details Card */}
          <div>
            <div className="glass-panel p-8 rounded-3xl sticky top-28 cinematic-shadow">
              {event.budget && (
                <div className="mb-8 pb-8 border-b border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Estimated Investment</p>
                  <p className="font-display text-3xl text-matte-black">
                    ₹{event.budget.min?.toLocaleString()}
                  </p>
                  {event.budget.max && (
                    <p className="text-sm text-gray-400 font-light">— ₹{event.budget.max?.toLocaleString()}</p>
                  )}
                </div>
              )}

              <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
                {event.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-light uppercase tracking-wider text-xs">Date</span>
                    <span className="text-matte-black font-medium">
                      {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </span>
                  </div>
                )}
                {event.attendees?.expected > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-light uppercase tracking-wider text-xs">Guests</span>
                    <span className="text-matte-black font-medium">~{event.attendees.expected}</span>
                  </div>
                )}
              </div>

              <Link to="/planner" className="block">
                <Button className="w-full" size="lg" variant="gold">Plan a Similar Event</Button>
              </Link>
              <Link to="/contact" className="block mt-3">
                <Button className="w-full" size="lg" variant="outline">Enquire Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
