import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import { VENDOR_CATEGORIES, EVENT_CATEGORIES, CATEGORY_ICONS } from '../constants/categories';

const serviceDetails = {
  Decoration: { desc: 'Stunning floral arrangements, stage setups, and thematic decor for any occasion.', img: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1000&auto=format&fit=crop' },
  Catering: { desc: 'Multi-cuisine menus crafted by expert chefs for weddings, parties, and corporate events.', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop' },
  Photography: { desc: 'Capture every precious moment with professional photographers and videographers.', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop' },
  Videography: { desc: 'Cinematic wedding films and event highlight reels.', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop' },
  'DJ & Music': { desc: 'High-energy DJs, live bands, and sound systems for unforgettable celebrations.', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop' },
  'Makeup Artists': { desc: 'Bridal and party makeup by certified professionals using premium products.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop' },
  Venues: { desc: 'Banquet halls, garden venues, and luxury spaces for events of all sizes.', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop' },
  Entertainment: { desc: 'Performers, magicians, and entertainers to delight your guests.', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop' },
  Transportation: { desc: 'Luxury cars, buses, and guest transport arrangements.', img: 'https://images.unsplash.com/photo-1503370971408-b19b7880757d?q=80&w=1000&auto=format&fit=crop' },
  Invitations: { desc: 'Custom-designed invitations, digital invites, and stationery.', img: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1000&auto=format&fit=crop' },
};

export default function Services() {
  return (
    <div className="bg-warm-white">
      {/* Cinematic Hero for Services */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-matte-black text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/50 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl px-4 mt-20"
        >
          <span className="text-champagne-gold uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">Our Expertise</span>
          <h1 className="font-display text-5xl md:text-7xl mb-6">The Collection</h1>
          <p className="text-white/60 font-light text-lg md:text-xl max-w-2xl mx-auto tracking-wide">
            An exclusive curation of premium services designed to transform your vision into an extraordinary reality.
          </p>
        </motion.div>
      </section>

      {/* Bento Grid Services */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[350px]">
            {VENDOR_CATEGORIES.map((cat, i) => {
              // Create dynamic bento sizes
              const isLarge = i === 0 || i === 3 || i === 6;
              const isTall = i === 1 || i === 8;
              const spanClass = isLarge ? 'md:col-span-2' : isTall ? 'md:row-span-2' : 'md:col-span-1';
              const img = serviceDetails[cat]?.img || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop';

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (i % 4) * 0.1, ease: "easeOut" }}
                  className={`${spanClass} relative rounded-3xl overflow-hidden group cursor-pointer`}
                >
                  <Link to={`/vendors?category=${encodeURIComponent(cat)}`} className="block w-full h-full">
                    <img 
                      src={img} 
                      alt={cat} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-black/20 to-black/10 group-hover:via-black/40 transition-colors duration-500" />
                    
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white/80 group-hover:bg-champagne-gold group-hover:text-matte-black transition-all duration-300 shadow-xl">
                      ↗
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl opacity-70">{CATEGORY_ICONS[cat]}</span>
                        <h3 className="font-display text-2xl md:text-3xl text-white">{cat}</h3>
                      </div>
                      <p className="text-white/60 font-light tracking-wide text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {serviceDetails[cat]?.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Types - Minimalist Pills */}
      <section className="py-32 bg-white rounded-t-[40px] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeading title="Moments We Celebrate" subtitle="Whatever the occasion, we bring it to life with unparalleled elegance." />
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {EVENT_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  to={`/events?category=${encodeURIComponent(cat)}`}
                  className="inline-block px-8 py-4 rounded-full glass-panel border border-gray-200 text-sm tracking-widest uppercase font-semibold text-charcoal hover:bg-matte-black hover:text-white transition-all duration-300"
                >
                  {cat}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <Link to="/planner">
              <Button size="lg" variant="gold">Begin Planning</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
