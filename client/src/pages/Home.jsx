import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { getFeaturedVendors } from '../api/vendors';
import { getFeaturedEvents } from '../api/events';
import ClientStoriesCarousel from '../components/ClientStoriesCarousel';
import Button from '../components/ui/Button';
import { MOCK_VENDORS } from '../data/mockVendors';

// ─── Images ──────────────────────────────────────────────────────────────────
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop';

const BENTO_IMAGES = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1000&auto=format&fit=crop',
];

// ─── Partners ─────────────────────────────────────────────────────────────────
const PARTNERS = [
  { name: 'Penguin Logistics', logo: '/penguin_logestics.png' },
  { name: 'Giftsby Ganesh', logo: '/Giftsby_ganesh.png' },
  { name: 'Avinash Arts', logo: '/Avinash_arts.png' },
  { name: 'Koushik Designs', logo: '/koushik_design.png' },
  { name: 'Vinay venues', logo: '/vinay_venues.png' },
  { name: 'Sahithi studio', logo: '/sahiti_studio.png' },
  { name: 'Nithin Marketing', logo: '/Nithin_marketing.png' },
  { name: 'Tejas kitchen', logo: '/Tejas_kitchen.png' },
];

// ─── Client Stories data ──────────────────────────────────────────────────────
const CLIENT_STORIES = [
  {
    id: 1,
    coupleNames: 'Meera & Arjun',
    storyTitle: 'Wedding Planner Review',
    testimonial: '"An absolute dream! Every detail flawless..."',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop',
    icon: '👫',
  },
  {
    id: 2,
    coupleNames: 'Priya & Rohit',
    storyTitle: 'Vendor Curation Story',
    testimonial: '"The best matching process. Smooth, professional experience."',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',
    icon: '🎊',
  },
  {
    id: 3,
    coupleNames: 'Sneha & Vivek',
    storyTitle: 'Overall Journey',
    testimonial: '"They captured our story perfectly. Unforgettable moments!"',
    image: 'https://images.unsplash.com/photo-1521543027963-77cf5a544d7e?q=80&w=600&auto=format&fit=crop',
    icon: '❤️',
  },
  {
    id: 4,
    coupleNames: 'Ananya & Vikram',
    storyTitle: 'Lakeside Venue Experience',
    testimonial: '"Breathtaking setting, stress-free execution. Highly recommend."',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop',
    icon: '🌅',
  },
  {
    id: 5,
    coupleNames: 'Tanya & Kabir',
    storyTitle: 'Destination Wedding',
    testimonial: '"The palace decor was beyond imagination. Thank you!"',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop',
    icon: '🏰',
  },
  {
    id: 6,
    coupleNames: 'Rhea & Dev',
    storyTitle: 'Corporate Gala Night',
    testimonial: '"Perfect execution. Our guests were completely wowed."',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    icon: '✨',
  },
];

// ─── Curated Experiences ──────────────────────────────────────────────────────
const EXPERIENCE_TABS = ['Weddings', 'Corporate', 'Destination', 'Galas'];

const CURATED_EXPERIENCES = {
  Weddings: [
    {
      id: 'w1',
      title: 'THE CAPITAL ARTISANS',
      subtitle: 'Bespoke florals kissing the Ganga Valley.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'w2',
      title: 'ANAND SOIREE',
      subtitle: 'Traditional elegance meets contemporary luxury.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'w3',
      title: 'A CANVAS CELEBRATION',
      subtitle: 'Art-inspired ceremonies in breathtaking venues.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    },
  ],
  Corporate: [
    {
      id: 'c1',
      title: 'THE MANDATE TECH GALA',
      subtitle: 'Award nights re-imagined with theatrical grandeur.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'c2',
      title: 'SUMMIT CONFLUENCE',
      subtitle: 'Professional meets prestigious — a seamless blend.',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'c3',
      title: 'ANNUAL LEADERSHIP CONCLAVE',
      subtitle: 'Inspiring atmospheres for visionary minds.',
      image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop',
    },
  ],
  Destination: [
    {
      id: 'd1',
      title: 'BALI HORIZON WEDDING',
      subtitle: 'Where cliffs meet the ocean at sunset.',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'd2',
      title: 'TUSCANY VOWS',
      subtitle: 'Golden vineyards, Italian romance, forever.',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'd3',
      title: 'UDAIPUR PALACE AFFAIR',
      subtitle: 'Royalty crafted in India\'s most storied city.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
    },
  ],
  Galas: [
    {
      id: 'g1',
      title: 'MASQUERADE NOIR',
      subtitle: 'Black-tie mystery under diamond chandeliers.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'g2',
      title: 'WHITE LOTUS GALA',
      subtitle: 'Ethereal white-on-white elegance redefined.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'g3',
      title: 'GOLD STANDARD EVENING',
      subtitle: 'Gilded luxury for India\'s elite galas.',
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=800&auto=format&fit=crop',
    },
  ],
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ label, title, subtitle, light = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="mb-14 text-center"
  >
    {label && (
      <span
        className={`text-xs uppercase tracking-[0.35em] font-semibold mb-3 block ${
          light ? 'text-champagne-gold' : 'text-champagne-gold'
        }`}
      >
        {label}
      </span>
    )}
    <h2
      className={`font-display text-4xl md:text-5xl tracking-tight mb-4 ${
        light ? 'text-white' : 'text-matte-black'
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`font-light tracking-wide ${light ? 'text-white/50' : 'text-gray-500'}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

// ─── Client Story Card ────────────────────────────────────────────────────────
function ClientStoryCard({ story, isHovered, onHover, onLeave }) {
  return (
    <motion.div
      className="flex-shrink-0 w-[calc(25%-18px)] min-w-[220px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
      whileHover={{ y: -6 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image with play button overlay */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={story.image}
          alt={story.coupleNames}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-matte-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Hover pause label */}
        {isHovered && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-medium tracking-widest uppercase px-2 py-1 rounded-full backdrop-blur-sm">
            Hover Pause
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <p className="font-display text-base font-semibold text-matte-black tracking-wide uppercase mb-0.5">
          {story.coupleNames}
        </p>
        <p className="text-xs text-gray-500 font-medium mb-2 tracking-wide">{story.storyTitle}</p>
        <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">
          {story.testimonial}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg">{story.icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Master Artisan Mini Card ─────────────────────────────────────────────────
function ArtisanCard({ vendor, index }) {
  const slug = vendor.slug || vendor._id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-champagne-gold/30 transition-all duration-300 group cursor-pointer"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-champagne-gold/50 transition-colors duration-300 shrink-0">
        <img
          src={vendor.coverImage?.url || vendor.logo?.url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80'}
          alt={vendor.businessName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&q=80'; }}
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{vendor.businessName}</p>
        <p className="text-champagne-gold text-xs tracking-wide mb-1">{vendor.specialty || vendor.category}</p>
        <p className="text-white/50 text-xs font-light line-clamp-2 leading-relaxed">
          {vendor.shortDescription}
        </p>
      </div>
      {/* Arrow */}
      <Link
        to={`/vendors/${slug}`}
        className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-champagne-gold/20 transition-colors duration-300 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-3.5 h-3.5 text-white/60 group-hover:text-champagne-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────
function ExperienceCard({ experience, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500"
      style={{ aspectRatio: '4/5' }}
    >
      <img
        src={experience.image}
        alt={experience.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-108"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-champagne-gold text-[10px] tracking-[0.3em] uppercase font-semibold mb-1">
          Featured
        </p>
        <h3 className="font-display text-white text-lg font-bold leading-tight mb-1">
          {experience.title}
        </h3>
        <p className="text-white/70 text-xs font-light leading-relaxed">
          {experience.subtitle}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null);
  const carouselRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef(null);

  // Experience tab state
  const [activeTab, setActiveTab] = useState('Weddings');

  // Featured artisans from mock data (always available, 3 featured ones)
  const featuredArtisans = MOCK_VENDORS.filter((v) => v.featured).slice(0, 3);

  const visibleCards = 4;
  const maxIndex = Math.max(0, CLIENT_STORIES.length - visibleCards);

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 4s, pause on hover
  useEffect(() => {
    if (isPaused) {
      clearInterval(autoSlideRef.current);
      return;
    }
    autoSlideRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(autoSlideRef.current);
  }, [isPaused, nextSlide]);

  return (
    <div className="bg-warm-white">
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] overflow-hidden bg-matte-black">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Luxury Event" className="w-full h-full object-cover opacity-60" />
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
              We Don't Plan Events.<br />
              <span className="text-champagne-gold font-light italic">We Craft Memories.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto tracking-wide">
              An exclusive platform connecting you with the world's finest event artisans. Elevate your celebration to an art form.
            </p>

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

      <ClientStoriesCarousel stories={CLIENT_STORIES} />
{/* ── Partners & Collaborations ── */}
      <section className="py-20 relative z-20 bg-warm-white -mt-10 rounded-t-[40px] border-t border-white/50 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold">Trusted By</span>
          <h2 className="font-display text-3xl md:text-4xl text-matte-black mt-3">Partners &amp; Collaborations</h2>
          <div className="w-16 h-[2px] bg-champagne-gold mx-auto mt-4" />
        </motion.div>

        <div className="marquee-wrapper py-6">
          <div className="marquee-track-right">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-champagne-gold/45 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-default w-[190px] h-[76px] shrink-0"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-[200%] max-h-[200%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-800 font-light mt-6 tracking-widest uppercase">
          MORE PARTNERSHIPS COMING SOON
        </p>
      </section>

      {/* ── The Collection (Bento Grid) ── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="The Collection" subtitle="Bespoke services for extraordinary celebrations" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
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

      {/* ── Master Artisans (Dark) ── */}
      <section className="py-32 bg-matte-black text-white rounded-[40px] mx-4 lg:mx-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-champagne-gold/5 rounded-full blur-[80px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-14"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold block mb-3">
                Visionary
              </span>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4 text-white">Master Artisans</h2>
              <p className="text-white/50 font-light tracking-wide max-w-md">
                Our exclusive network of vetted professionals who turn imagination into reality.
              </p>
            </div>
            <Link to="/vendors" className="hidden md:block mt-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-matte-black">
                View Gallery
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredArtisans.map((vendor, i) => (
              <ArtisanCard key={vendor._id} vendor={vendor} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-10 md:hidden">
            <Link to="/vendors">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-matte-black">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Curated Experiences ── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Curated Experiences"
            subtitle="Discover our portfolio of extraordinary celebrations"
          />

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
            {EXPERIENCE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-matte-black text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-matte-black hover:text-matte-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Experience Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {(CURATED_EXPERIENCES[activeTab] || []).map((exp, i) => (
                <ExperienceCard key={exp.id} experience={exp} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-16">
            <Link to="/events">
              <Button variant="ghost" size="lg" className="border-b border-matte-black rounded-none px-0 py-1 hover:bg-transparent hover:border-champagne-gold hover:text-champagne-gold">
                View The Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            label="VOICES"
            title="Client Stories"
            subtitle="Reflecting on moments made timeless"
          />

          {/* Carousel Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-300 group"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Cards Track */}
            <div
              ref={carouselRef}
              className="overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => { setIsPaused(false); setHoveredCard(null); }}
            >
              <motion.div
                className="flex gap-6"
                animate={{ x: `calc(-${carouselIndex * (100 / visibleCards)}% - ${carouselIndex * 6}px)` }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              >
                {CLIENT_STORIES.map((story) => (
                  <ClientStoryCard
                    key={story.id}
                    story={story}
                    isHovered={hoveredCard === story.id}
                    onHover={() => setHoveredCard(story.id)}
                    onLeave={() => setHoveredCard(null)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-300 group"
              aria-label="Next"
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === carouselIndex
                    ? 'w-6 h-2 bg-matte-black'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* View All */}
          <div className="text-center mt-10">
            <Link to="/events">
              <button className="px-8 py-3 rounded-full bg-matte-black text-white text-sm font-medium tracking-wide hover:bg-charcoal transition-colors duration-300 shadow-sm">
                View All
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
