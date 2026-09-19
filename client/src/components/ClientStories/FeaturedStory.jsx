import React from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

export default function FeaturedStory({ story, onPrev, onNext, openWatch, counter }) {
  const stars = Array.from({ length: story.rating }, (_, i) => (
    <FaStar key={i} className="star" style={{ color: '#d4af37' }} />
  ));
  const emptyStars = Array.from({ length: 5 - story.rating }, (_, i) => (
    <FaStar key={i + story.rating} className="star" style={{ opacity: 0.3, color: '#d4af37' }} />
  ));
  return (
    <section className="book-container">
      {/* Side previews (fanned cards) */}
      <div className="side-preview left">
        <img src={story.prevImage || '/assets/placeholder.jpg'} alt="prev" />
      </div>
      <div className="side-preview right">
        <img src={story.nextImage || '/assets/placeholder.jpg'} alt="next" />
      </div>

      {/* Left page – image */}
      <div className="book-page-left">
        <img src={story.image} alt={story.names} />
        <div className="play-btn" onClick={openWatch} title="Watch the story">
          <FaPlay />
        </div>
      </div>

      {/* Right page – cream paper with text */}
      <div className="book-page-right">
        <div>
          <div className="category">{story.category}</div>
          <div className="title">{story.names}</div>
          <div className="subtitle">{story.tagline}</div>
          <div className="location"><FaMapMarkerAlt className="pin" /> {story.location}</div>
          {story.quote && <div className="quote">"{story.quote}"</div>}
        </div>
        <div>
          <div className="rating">{stars}{emptyStars}</div>
          <div className="author">{story.author}</div>
        </div>
      </div>

      {/* Controls – centered below book */}
      <div className="book-controls">
        <button className="control-btn" onClick={onPrev} aria-label="Previous story">
          <FaChevronLeft />
        </button>
        <span className="counter">{counter}</span>
        <button className="control-btn" onClick={onNext} aria-label="Next story">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
