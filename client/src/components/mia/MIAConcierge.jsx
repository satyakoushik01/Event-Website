import { useState } from 'react';
import './mia.css';
import { motion, AnimatePresence } from 'framer-motion';
import MIAPanel from './MIAPanel';

/**
 * MIAButton – floating circular trigger button with glassmorphism,
 * pulse ring, soft glow, ripple on click, and "Meet MIA" tooltip.
 */
function MIAButton({ onClick, isOpen }) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    onClick();
  };

  return (
    <div className="mia-fab-wrap">
      {/* Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.span
            className="mia-tooltip"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            role="tooltip"
          >
            Chat
          </motion.span>
        )}
      </AnimatePresence>

      {/* Outer glow ring – always rendered, breathing */}
      <span className="mia-fab-glow" aria-hidden="true" />

      {/* Pulse rings */}
      {!isOpen && (
        <>
          <span className="mia-pulse mia-pulse-1" aria-hidden="true" />
          <span className="mia-pulse mia-pulse-2" aria-hidden="true" />
        </>
      )}

      {/* Ripple */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key="ripple"
            className="mia-ripple"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* The button itself */}
      <motion.button
        className="mia-fab"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        onClick={handleClick}
        aria-label={isOpen ? 'Close MIA concierge' : 'Open MIA concierge'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <motion.span
          className="mia-fab-icon"
          initial={false}
          animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 0.85 : 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {isOpen ? '✕' : '✦'}
        </motion.span>
      </motion.button>
    </div>
  );
}

/**
 * MIAConcierge – root orchestrator.
 * Renders the floating button + the panel and manages open/close state.
 * Drop this once into Layout and it works on every page.
 */
export default function MIAConcierge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MIAPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* FAB positioned bottom-right, outside the panel stacking context */}
      <div className="mia-fab-container" aria-live="polite">
        <MIAButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      </div>
    </>
  );
}
