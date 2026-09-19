import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function StoryGrid({ stories, onCardClick }) {
  return (
    <div className="story-grid">
      {stories.map(story => (
        <div key={story.id} className="grid-card" onClick={() => onCardClick(story)}>
          <div className="grid-image" style={{ backgroundImage: `url(${story.image})` }}>
            <div className="grid-play"><FaPlay /></div>
          </div>
          <div className="grid-info">
            <div className="grid-title">{story.title}</div>
            <div className="grid-meta">
              <span className="category">{story.category}</span>
              <span className="location"><FaMapMarkerAlt /> {story.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
