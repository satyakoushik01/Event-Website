import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getFeaturedVendors } from '../api/vendors';
import { getFeaturedEvents } from '../api/events';
import Button from '../components/ui/Button';
import VendorCard from '../components/vendors/VendorCard';
import EventCard from '../components/events/EventCard';
import Loader from '../components/ui/Loader';

// Sample high-quality Unsplash luxury event images
const HERO_IMAGE = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";
const BENTO_IMAGES = [
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", // Wedding
  "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop", // Food
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1000&auto=format&fit=crop", // Photography
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop", // Decor
];

// ── Trusted Partners ─────────────────────────────────────────────────────
const PARTNERS = [
  { name: 'Maruti Suzuki' },
  { name: 'Coca-Cola' },
  { name: 'Shreyas Media' },
  { name: 'Zee Telugu' },
  { name: 'SRM University AP' },
  { name: 'BookMyShow' },
  { name: 'Red Bull' },
  { name: 'Taj Hotels' },
];

function PartnerLogo({ name }) {
  const getLogoUrl = (name) => {
    switch (name) {
      case 'Maruti Suzuki':
        return 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Maruti_Suzuki_logo.svg';
      case 'Coca-Cola':
        return 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg';
      case 'Shreyas Media':
        return 'https://yt3.googleusercontent.com/ytc/AIdro_k6PvxT-tH9X67J6x9q2XG7yFm16y06z8-t5352lQ=s900-c-k-c0x00ffffff-no-rj';
      case 'Zee Telugu':
        return 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Zee_Telugu_2025.svg';
      case 'SRM University AP':
        return 'https://srmap.edu.in/wp-content/uploads/2019/08/SRM-AP-logo.png';
      case 'BookMyShow':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/f3/BookMyShow_Logo.svg';
      case 'Red Bull':
        return 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Red_Bull_logo.svg';
      case 'Taj Hotels':
        return 'https://upload.wikimedia.org/wikipedia/commons/0/07/Taj_Hotels_logo.svg';
      default:
        return '';
    }
  };

  const url = getLogoUrl(name);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={`${name} Logo`}
      className="max-w-[85%] max-h-[70%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

// Reusable cinematic section header
const SectionHeader = ({ title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-16 text-center max-w-2xl mx-auto"
  >
    <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4 text-matte-black">{title}</h2>
    {subtitle && <p className="text-gray-500 font-light tracking-wide">{subtitle}</p>}
  </motion.div>
);

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    Promise.all([getFeaturedVendors(), getFeaturedEvents()])
      .then(([vRes, eRes]) => {
        setVendors(vRes.data.vendors || []);
        setEvents(eRes.data.events || []);
      })
      .catch(() => setError('Unable to load featured content.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-warm-white">
      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] overflow-hidden bg-matte-black">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={HERO_IMAGE} 
            alt="Luxury Event" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/50 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 text-balance leading-[1.1]">
              We Don't Plan Events.<br/>
              <span className="text-champagne-gold font-light italic">We Craft Memories.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto tracking-wide">
              An exclusive platform connecting you with the world's finest event artisans. Elevate your celebration to an art form.
            </p>
            
            {/* Floating Glass Booking CTA */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-dark rounded-full p-2 pl-8 inline-flex items-center gap-6 mx-auto border border-white/20 shadow-2xl"
            >
              <span className="text-white/80 text-sm tracking-widest uppercase hidden sm:block">Begin Your Journey</span>
              <Link to="/planner">
                <Button variant="gold" size="lg" className="rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  The Planner
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trusted Partners & Collaborations ─────────────────────────────── */}
      <section className="py-20 relative z-20 bg-warm-white -mt-10 rounded-t-[40px] border-t border-white/50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold">Trusted By</span>
          <h2 className="font-display text-3xl md:text-4xl text-matte-black mt-3">Partners & Collaborations</h2>
          <div className="w-16 h-[2px] bg-champagne-gold mx-auto mt-4" />
        </motion.div>

        {/* Infinite scrolling marquee wrapper moving from left to right */}
        <div className="marquee-wrapper py-6">
          <div className="marquee-track-right">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-champagne-gold/45 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-default w-[190px] h-[76px] shrink-0"
              >
                <PartnerLogo name={partner.name} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 font-light mt-6 tracking-widest uppercase">
          MORE PARTNERSHIPS COMING SOON
        </p>
      </section>



      {/* Services Bento Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="The Collection" subtitle="Bespoke services for extraordinary celebrations" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
            {/* Large Card */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={BENTO_IMAGES[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Weddings" />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-display text-4xl text-white mb-2">Signature Weddings</h3>
                <p className="text-white/70 font-light tracking-wide">Timeless elegance tailored to your love story.</p>
              </div>
            </motion.div>

            {/* Square Cards */}
            <motion.div whileHover={{ scale: 0.98 }} className="relative rounded-3xl overflow-hidden group cursor-pointer">
              <img src={BENTO_IMAGES[1]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Catering" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-display text-2xl text-white">Culinary Arts</h3>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 0.98 }} className="relative rounded-3xl overflow-hidden group cursor-pointer">
              <img src={BENTO_IMAGES[2]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Photography" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-display text-2xl text-white">Cinematography</h3>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">Explore All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors - Cinematic Showcase */}
      <section className="py-32 bg-matte-black text-white rounded-[40px] mx-4 lg:mx-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/10 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4 text-white">Master Artisans</h2>
              <p className="text-white/50 font-light tracking-wide max-w-md">Our exclusive network of vetted professionals who turn imagination into reality.</p>
            </div>
            <Link to="/vendors" className="hidden md:block">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-matte-black">View Gallery</Button>
            </Link>
          </motion.div>

          {loading ? (
            <Loader className="py-20" />
          ) : error ? (
            <p className="text-red-400 font-light">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendors.slice(0, 4).map((v, i) => (
                <VendorCard key={v._id} vendor={v} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Events - Editorial Style */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Curated Experiences" subtitle="Discover our portfolio of extraordinary celebrations" />
          
          {loading ? (
            <Loader className="py-20" />
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Link to="/events">
              <Button variant="ghost" size="lg" className="border-b border-matte-black rounded-none px-0 py-1 hover:bg-transparent hover:border-champagne-gold hover:text-champagne-gold">
                View The Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
