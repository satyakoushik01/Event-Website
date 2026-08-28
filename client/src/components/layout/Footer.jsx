import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-matte-black text-white pt-12 pb-6 relative overflow-hidden">
      {/* Subtle luxury glow in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-champagne-gold/30 to-transparent" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-champagne-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <img src="/logo.png" alt="Moments Group" className="h-24 w-auto object-contain" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm font-light">
              Crafting unforgettable celebrations with premium vendors and meticulous event planning. An exclusive experience for the extraordinary.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-display text-sm tracking-widest text-champagne-gold mb-6 uppercase">Explore</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li>
                <Link to="/vendors" className="hover:text-white transition-colors duration-300">Curated Vendors</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors duration-300">Exclusive Events</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors duration-300">Our Services</Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-white transition-colors duration-300">The Planner</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-sm tracking-widest text-champagne-gold mb-6 uppercase">HUB</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-300">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors duration-300">Careers</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-sm tracking-widest text-champagne-gold mb-6 uppercase">Connect</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li>
                <a href="mailto:momentshubinfo@gmail.com" className="hover:text-white transition-colors duration-300">momentshubinfo@gmail.com</a>
              </li>
              <li>
                <a href="tel:+91 8977557685" className="hover:text-white transition-colors duration-300">+91 8977557685</a>
              </li>
              <li className="text-white/55 pt-2">
                Benz circle, Vijayawada, India
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 tracking-wider uppercase font-light">
            &copy; {new Date().getFullYear()} Moments Group. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-champagne-gold transition-colors text-xs tracking-wider uppercase">Instagram</a>
            <a href="#" className="text-white/40 hover:text-champagne-gold transition-colors text-xs tracking-wider uppercase">Pinterest</a>
            <a href="#" className="text-white/40 hover:text-champagne-gold transition-colors text-xs tracking-wider uppercase">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
