import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 'eventType', title: 'What type of event?', icon: '🎪',
    type: 'select',
    options: ['Wedding', 'Corporate Event', 'Birthday Celebration', 'Engagement', 'Housewarming', 'Anniversary', 'Baby Shower', 'Award Ceremony', 'Product Launch', 'Other'],
  },
  {
    id: 'eventDate', title: 'When is your event?', icon: '📅',
    type: 'date', placeholder: 'Select a date',
  },
  {
    id: 'location', title: 'Where will it be held?', icon: '📍',
    type: 'text', placeholder: 'City, Venue, or Specific Address…',
  },
  {
    id: 'guests', title: 'How many guests are you expecting?', icon: '👥',
    type: 'select',
    options: ['Under 25', '25 – 50', '51 – 100', '101 – 200', '201 – 500', '500+'],
  },
  {
    id: 'budget', title: 'What is your approximate budget?', icon: '💰',
    type: 'select',
    options: ['Under ₹1 Lakh', '₹1 – 3 Lakhs', '₹3 – 5 Lakhs', '₹5 – 10 Lakhs', '₹10 – 25 Lakhs', '₹25 Lakhs+', 'Not Decided Yet'],
  },
  {
    id: 'theme', title: 'Any theme or style preference?', icon: '🎨',
    type: 'select',
    options: ['Classic Elegance', 'Modern Minimalist', 'Royal & Opulent', 'Rustic & Bohemian', 'Garden & Floral', 'Vintage & Retro', 'Destination / Outdoor', 'No Preference'],
  },
  {
    id: 'services', title: 'Which services do you need?', icon: '✨',
    type: 'multiselect',
    options: ['Photography', 'Videography', 'Catering', 'Décor & Florals', 'Entertainment / DJ', 'Lighting & AV', 'Venue', 'Invitation Design', 'Makeup & Styling', 'Transportation', 'Wedding Cake', 'Event Coordinator'],
  },
  {
    id: 'notes', title: 'Any special requests or notes?', icon: '📝',
    type: 'textarea', placeholder: 'Dietary restrictions, preferred vendors, accessibility needs, specific ideas…',
  },
];

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.25 } }),
};

/**
 * MIAEventPlanner – 8-step conversational event planner.
 * Props: onComplete {function(data)} – called with collected data when done
 */
export default function MIAEventPlanner({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [dir, setDir] = useState(1);
  const current = STEPS[step];
  const val = data[current.id] ?? (current.type === 'multiselect' ? [] : '');
  const progress = ((step + 1) / STEPS.length) * 100;

  const update = (v) => setData(prev => ({ ...prev, [current.id]: v }));
  const toggleMulti = (opt) => {
    const arr = data[current.id] || [];
    update(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);
  };

  const next = () => {
    if (step < STEPS.length - 1) { setDir(1); setStep(s => s + 1); }
    else onComplete(data);
  };
  const prev = () => { if (step > 0) { setDir(-1); setStep(s => s - 1); } };

  const canContinue = current.type === 'multiselect'
    ? (data[current.id] || []).length > 0
    : !!val;

  return (
    <div className="mia-planner">
      {/* Progress */}
      <div className="mia-planner-progress">
        <div className="mia-planner-progress-track">
          <motion.div
            className="mia-planner-progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="mia-planner-progress-label">Step {step + 1} of {STEPS.length}</span>
      </div>

      {/* Step card */}
      <div className="mia-planner-body">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            className="mia-planner-step"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <span className="mia-planner-step-icon">{current.icon}</span>
            <h3 className="mia-planner-step-title">{current.title}</h3>

            {/* Input: select */}
            {current.type === 'select' && (
              <div className="mia-planner-options">
                {current.options.map(opt => (
                  <motion.button
                    key={opt}
                    className={`mia-planner-opt ${val === opt ? 'mia-planner-opt--active' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { update(opt); }}
                  >
                    {val === opt && <span className="mia-planner-opt-check">✓</span>}
                    {opt}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input: multiselect */}
            {current.type === 'multiselect' && (
              <>
                <p className="mia-planner-multi-hint">Select all that apply</p>
                <div className="mia-planner-options mia-planner-options--wrap">
                  {current.options.map(opt => {
                    const active = (data[current.id] || []).includes(opt);
                    return (
                      <motion.button
                        key={opt}
                        className={`mia-planner-opt mia-planner-opt--chip ${active ? 'mia-planner-opt--active' : ''}`}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleMulti(opt)}
                      >
                        {active && <span className="mia-planner-opt-check">✓</span>}
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Input: text */}
            {current.type === 'text' && (
              <input
                className="mia-planner-input"
                placeholder={current.placeholder}
                value={val}
                onChange={e => update(e.target.value)}
                autoFocus
              />
            )}

            {/* Input: date */}
            {current.type === 'date' && (
              <input
                className="mia-planner-input"
                type="date"
                value={val}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => update(e.target.value)}
              />
            )}

            {/* Input: textarea */}
            {current.type === 'textarea' && (
              <textarea
                className="mia-planner-input mia-planner-textarea"
                placeholder={current.placeholder}
                value={val}
                onChange={e => update(e.target.value)}
                rows={4}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mia-planner-nav">
        <motion.button
          className="mia-btn mia-btn--ghost"
          onClick={prev}
          disabled={step === 0}
          whileHover={step > 0 ? { scale: 1.02 } : {}}
          whileTap={step > 0 ? { scale: 0.97 } : {}}
          style={{ opacity: step === 0 ? 0.3 : 1 }}
        >
          ← Previous
        </motion.button>

        <div className="mia-planner-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`mia-planner-dot ${i === step ? 'mia-planner-dot--active' : i < step ? 'mia-planner-dot--done' : ''}`} />
          ))}
        </div>

        <motion.button
          className={`mia-btn ${canContinue ? 'mia-btn--dark' : 'mia-btn--disabled'}`}
          onClick={canContinue ? next : undefined}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.97 } : {}}
        >
          {step === STEPS.length - 1 ? 'Generate Summary →' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  );
}
