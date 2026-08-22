import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const TIME_SLOTS = [
  '10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM',
  '05:00 PM','05:30 PM',
];

/* Dates that are "available" – skip past dates and Sundays (demo) */
function isAvailable(year, month, day) {
  const d = new Date(year, month, day);
  const today = new Date(); today.setHours(0,0,0,0);
  return d >= today && d.getDay() !== 0;
}

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/**
 * MIAMeetingScheduler – inline calendar + time-slot picker.
 * Props: onConfirm {function({date, time})}
 */
export default function MIAMeetingScheduler({ onConfirm }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [selTime, setSelTime] = useState(null);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); setSelDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); setSelDay(null); };

  const cells = buildCalendar(year, month);
  const selectedDate = selDay ? `${selDay} ${MONTHS[month]} ${year}` : null;
  const canConfirm = selDay && selTime;

  return (
    <motion.div
      className="mia-sched"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mia-sched-header">
        <div className="mia-sched-icon">📅</div>
        <h3 className="mia-sched-title">Book a Consultation</h3>
        <p className="mia-sched-sub">Choose a convenient date and time for your MIA consultation.</p>
      </div>

      {/* Calendar */}
      <div className="mia-cal">
        <div className="mia-cal-nav">
          <motion.button className="mia-cal-nav-btn" onClick={prevMonth} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>‹</motion.button>
          <AnimatePresence mode="wait">
            <motion.span key={`${year}-${month}`} className="mia-cal-month" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
              {MONTHS[month]} {year}
            </motion.span>
          </AnimatePresence>
          <motion.button className="mia-cal-nav-btn" onClick={nextMonth} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>›</motion.button>
        </div>

        {/* Day labels */}
        <div className="mia-cal-grid mia-cal-grid--header">
          {DAYS.map(d => <span key={d} className="mia-cal-day-label">{d}</span>)}
        </div>

        {/* Date cells */}
        <AnimatePresence mode="wait">
          <motion.div key={`${year}-${month}`} className="mia-cal-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {cells.map((day, i) => {
              if (!day) return <span key={`e-${i}`} />;
              const avail = isAvailable(year, month, day);
              const active = selDay === day;
              return (
                <motion.button
                  key={day}
                  className={`mia-cal-day ${avail ? 'mia-cal-day--avail' : 'mia-cal-day--unavail'} ${active ? 'mia-cal-day--active' : ''}`}
                  onClick={() => avail && setSelDay(day)}
                  whileHover={avail ? { scale: 1.12 } : {}}
                  whileTap={avail ? { scale: 0.92 } : {}}
                  disabled={!avail}
                >
                  {day}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <p className="mia-cal-legend"><span className="mia-cal-legend-dot" /> Available</p>
      </div>

      {/* Time slots */}
      <AnimatePresence>
        {selDay && (
          <motion.div className="mia-sched-slots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p className="mia-sched-slots-label">Available times for {selectedDate}</p>
            <div className="mia-sched-slots-grid">
              {TIME_SLOTS.map((t) => (
                <motion.button
                  key={t}
                  className={`mia-sched-slot ${selTime === t ? 'mia-sched-slot--active' : ''}`}
                  onClick={() => setSelTime(t)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected summary */}
      <AnimatePresence>
        {canConfirm && (
          <motion.div className="mia-sched-selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="mia-sched-selected-icon">✓</span>
            <span>{selectedDate} at {selTime}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm */}
      <motion.div className="mia-summary-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <motion.button
          className={`mia-btn ${canConfirm ? 'mia-btn--gold' : 'mia-btn--disabled'}`}
          onClick={canConfirm ? () => onConfirm({ date: selectedDate, time: selTime }) : undefined}
          whileHover={canConfirm ? { scale: 1.02 } : {}}
          whileTap={canConfirm ? { scale: 0.97 } : {}}
        >
          Confirm Consultation →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
