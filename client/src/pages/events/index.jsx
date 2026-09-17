import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../../api/events';
import EventCard from '../../components/EventCard';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="spinner">Loading events...</div>;

  // Simple sections: Festive, Weekend, All (based on category flags)
  const festive = events.filter(e => /Ganesh|Diwali|Dussehra/i.test(e.title));
  const weekend = events.filter(e => /Comedy|DJ|Band/i.test(e.title));
  const others = events.filter(e => !festive.includes(e) && !weekend.includes(e));

  const renderSection = (title, list) => (
    <section className="event-section">
      <h2>{title}</h2>
      <div className="event-grid">
        {list.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="events-page">
      <h1 className="page-title">Ongoing Events</h1>
      {renderSection('Festive Specials', festive)}
      {renderSection('Weekend Specials', weekend)}
      {renderSection('All Events', others)}
    </div>
  );
};

export default EventsPage;
