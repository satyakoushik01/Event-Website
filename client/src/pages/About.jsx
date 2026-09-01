import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const values = [
  { title: 'Passion', desc: 'We treat your celebration as our own masterpiece.' },
  { title: 'Excellence', desc: 'Only the finest, vetted artisans make our platform.' },
  { title: 'Trust', desc: 'Transparent pricing and verified authenticity.' },
  { title: 'Precision', desc: 'Every detail is curated to absolute perfection.' },
];

const testimonials = [
  {
    name: 'Meera & Arjun Kapoor',
    location: 'Mumbai · Udaipur Wedding',
    story: 'Moments Group turned our Udaipur wedding into an absolute masterpiece. The design, coordination, and floral arrangements were flawless.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Priya & Rohit Sharma',
    location: 'Delhi · Grand Ballroom',
    story: 'Extremely professional curation. They matched us with vendors who understood our exact aesthetic, making the entire journey stress-free.',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Ananya & Vikram Mehta',
    location: 'Bangalore · Lakeside Estate',
    story: 'Every single floral detail, light placement, and sound setup was curated to absolute perfection. Our guests were completely wowed.',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Sneha & Dev Nair',
    location: 'Goa · Sunset Soirée',
    story: 'From custom invitations to beachside layout, the execution felt like a cinematic dream. We couldn’t have asked for a better planner.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Riya & Kshitij Goel',
    location: 'Jaipur · Palace Wedding',
    story: 'They managed our 500-guest heritage wedding with ultimate grace and precision. The catering was Michelin-grade and spectacular.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Tanya & Aashish Singhal',
    location: 'Hyderabad · Heritage Gala',
    story: 'The attention to detail in lighting and musical acts made our reception unforgettable. Moments Group is truly in a class of its own.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Kavya & Sidharth Roy',
    location: 'Kolkata · Colonial Mansion',
    story: 'A perfectly organized celebration. Their coordination team was invisible yet handled every custom request with absolute precision.',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Pooja & Manish Malhotra',
    location: 'Chennai · Temple Grounds',
    story: 'The absolute gold standard of events. They respected our heritage traditions while bringing in contemporary elegance.',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Divya & Sameer Verma',
    location: 'Pune · Vineyard Celebration',
    story: 'An magical outdoor sangeet and winery brunch. Moments Group took care of everything from transport to decor seamlessly.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    name: 'Ishita & Rishabh Sen',
    location: 'Udaipur · Island Palace',
    story: 'A grand three-day celebration curated to the highest standards. We are incredibly grateful for their impeccable service.',
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&q=80&auto=format&fit=crop',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

const founderImage = '/founder.jpg';

export default function About() {
  return (
    <div className="bg-warm-white overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-matte-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop"
            alt="Our Story"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 w-full mt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-8 block">Our Maison</span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-8 leading-tight">
              Crafting Memories<br /><span className="italic font-light text-champagne-gold">Since 2020.</span>
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-2xl leading-relaxed">
              Born from a belief that every celebration deserves to be extraordinary, Moments Group is India's most exclusive event planning platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-6 block">The Story</span>
              <h2 className="font-display text-4xl md:text-5xl mb-8 text-matte-black leading-tight">
                We Transform Vision Into Reality
              </h2>
              <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
              <p className="text-gray-500 leading-relaxed mb-6 font-light text-lg">
                Moments Group was born from a simple belief: every celebration deserves to be extraordinary. We set out to transform the chaotic world of event planning into a seamless, joyful journey.
              </p>
              <p className="text-gray-500 leading-relaxed font-light text-lg mb-12">
                Today, we connect discerning families and businesses with the finest artisans across India — from intimate soirées to grand destination weddings attended by hundreds.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="lg">Begin Your Journey</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden cinematic-shadow h-[550px]">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
                  alt="Event celebration"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating glass stat */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 glass-panel rounded-2xl p-6 cinematic-shadow"
              >
                <p className="font-display text-4xl text-matte-black">10K+</p>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">Memories Crafted</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-matte-black text-white rounded-[40px] mx-4 lg:mx-8 shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-3 block">Our Philosophy</span>
            <h2 className="font-display text-3xl md:text-4xl">What Drives Us</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-matte-black py-8 px-6 group hover:bg-charcoal transition-colors duration-500"
              >
                <div className="w-6 h-[1px] bg-champagne-gold mb-6 group-hover:w-12 transition-all duration-500" />
                <h3 className="font-display text-xl text-white mb-3">{v.title}</h3>
                <p className="text-white/50 font-light leading-relaxed text-xs">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Founder */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-champagne-gold mb-6 block">Visionary</span>
              <h2 className="font-display text-4xl md:text-5xl mb-8 text-matte-black leading-tight">
                Meet the Founder
              </h2>
              <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
              <h3 className="font-display text-2xl text-matte-black mb-4">Satya Koushik Devarabhotla</h3>
              <p className="text-gray-500 leading-relaxed mb-6 font-light text-lg">
                A passionate young entrepreneur, "The MomentsHub" brings a fresh, modern approach to the event management industry. By combining creative vision with smart digital innovations, We make event planning effortless and seamless for clients. Built on dedication and a love for celebration, "The MomentsHub" is focused on turning special occasions into unforgettable, timeless memories.
              </p>
              <p className="text-gray-500 leading-relaxed mb-12 font-light text-lg">
                "Our mission isn't just to plan events. We create an ecosystem where world-class artisans and visionary clients can collaborate to craft moments that transcend time."
              </p>

              <div className="glass-panel p-6 rounded-2xl cinematic-shadow inline-flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-matte-black text-champagne-gold flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Direct Contact</p>
                  <a href="mailto:founder@momentsgroup.com" className="font-medium text-matte-black hover:text-champagne-gold transition-colors">founder@momentsgroup.com</a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden cinematic-shadow aspect-[4/5] relative group max-w-sm mx-auto lg:max-w-[80%] lg:ml-auto lg:mr-0">
                <img
                  src={founderImage}
                  alt="Satya Koushik Devarabhotla"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
