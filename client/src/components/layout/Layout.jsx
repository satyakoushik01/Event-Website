import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MIAConcierge from '../mia/MIAConcierge';

// Ambient Background with noise and soft glowing orbs
const CinematicBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-warm-white dark:bg-matte-black transition-colors duration-300">
    <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-50"></div>
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 50, 0],
        y: [0, -30, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-soft-gold/20 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -40, 0],
        y: [0, 40, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-champagne-gold/15 rounded-full blur-[150px]"
    />
  </div>
);

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative bg-warm-white text-gray-900 dark:bg-matte-black dark:text-white transition-colors duration-300">
      <CinematicBackground />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex flex-col w-full relative z-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MIAConcierge />
    </div>
  );
}
