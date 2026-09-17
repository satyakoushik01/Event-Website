import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShareAlt, FaHeart, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaInfoCircle, FaRegClock, FaGlobe, FaUserCheck } from 'react-icons/fa';
import events from '../../mockData/events';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id) || events.find(e => e.id === "7") || events[0];
  
  const [activeTab, setActiveTab] = useState('About Event');
  const [selectedDate, setSelectedDate] = useState('Fri, 20 Sep');
  const [selectedTime, setSelectedTime] = useState('6:00 PM');

  const tabs = ['About Event', 'Highlights', 'Venue', 'Terms & Conditions'];
  const dates = ['Fri, 20 Sep', 'Sat, 21 Sep', 'Sun, 22 Sep'];
  const timings = ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'];

  const handleBook = () => {
    navigate(`/events/${event.id}/checkout`);
  };

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column - Image & Selector */}
        <div className="lg:w-[40%] flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 aspect-[4/5]">
            <img 
              src={event.images[0]} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            {event.badge && (
              <div className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold tracking-wider rounded bg-champagne-gold text-matte-black uppercase shadow-lg">
                {event.badge}
              </div>
            )}
          </div>

          <div className="bg-charcoal border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-display text-off-white mb-4">Select Date & Show Timing</h3>
            
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {dates.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-colors border ${
                    selectedDate === d 
                      ? 'bg-champagne-gold text-matte-black border-champagne-gold' 
                      : 'bg-transparent text-soft-gray border-white/10 hover:border-champagne-gold/50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-medium text-off-white mb-3">Show Timings</h4>
            <div className="flex flex-wrap gap-2">
              {timings.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                    selectedTime === t 
                      ? 'bg-champagne-gold text-matte-black border-champagne-gold' 
                      : 'bg-transparent text-soft-gray border-white/10 hover:border-champagne-gold/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:w-[60%] flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl md:text-4xl font-display text-off-white">{event.title}</h1>
            <div className="flex gap-3 text-soft-gray">
              <button className="hover:text-champagne-gold transition-colors"><FaShareAlt size={20}/></button>
              <button className="hover:text-champagne-gold transition-colors"><FaHeart size={20}/></button>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full text-soft-gray w-fit mb-6 uppercase tracking-wider">
             {event.tags?.[0] || event.category}
          </div>

          <div className="space-y-3 text-sm text-soft-gray mb-8">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-champagne-gold" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-champagne-gold" />
              <span>20 Sep 2026 - 22 Sep 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-champagne-gold font-bold">₹</span>
              <span>Starting from <strong className="text-off-white text-lg font-display">₹{event.price}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-champagne-gold mt-2">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-white/20" />
              <span className="text-soft-gray ml-2">4.0 (224 reviews)</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-champagne-gold text-champagne-gold' 
                    : 'border-transparent text-soft-gray hover:text-off-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-sm text-soft-gray leading-relaxed mb-8">
            <p>{event.description}</p>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaCalendarAlt size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Date</p>
                <p className="text-sm text-off-white">20 Sep 2026 - 22 Sep 2026</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaUserCheck size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Age Restriction</p>
                <p className="text-sm text-off-white">{event.ageRestriction || '16+'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaMapMarkerAlt size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Venue</p>
                <p className="text-sm text-off-white">{event.location}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaInfoCircle size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Organizer</p>
                <p className="text-sm text-off-white">{event.organizer || 'MomentsHub'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaMapMarkerAlt size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Location</p>
                <p className="text-sm text-off-white">{event.location.split(',')[1]?.trim() || event.location}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaStar size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Event Highlights</p>
                <ul className="text-sm text-off-white list-disc list-inside mt-1 space-y-1">
                  {event.highlights?.map((h, i) => <li key={i}>{h}</li>) || <li>Live Performances</li>}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaRegClock size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Duration</p>
                <p className="text-sm text-off-white">{event.duration || '4 hours'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 text-champagne-gold"><FaGlobe size={16}/></div>
              <div>
                <p className="text-xs text-soft-gray/70">Language</p>
                <p className="text-sm text-off-white">{event.language || 'English, Hindi'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-charcoal/90 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 lg:px-8">
          <div>
            <p className="text-xs text-soft-gray">Starting from</p>
            <p className="text-2xl font-display text-off-white font-bold">₹{event.price}</p>
          </div>
          <button 
            onClick={handleBook}
            className="px-8 py-3 rounded bg-champagne-gold text-matte-black font-semibold hover:bg-soft-gold transition-colors"
          >
            Book Event / Show
          </button>
        </div>
      </div>
    </div>
  );
}
