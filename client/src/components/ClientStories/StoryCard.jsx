import React from 'react';
import './clientStories.css';

export default function StoryCard({ story, onClick }) {
  return (
    <div className="story-card" onClick={onClick}>
      <div className="story-image-wrapper">
        <img src={story.image} alt={story.names} loading="lazy" className="story-image" />
        <div className="story-category-tag">{story.category}</div>
      </div>
      <div className="story-info">
        <h3 className="story-title">{story.names}</h3>
        <p className="story-tagline">{story.tagline}</p>
      </div>
    </div>
  );
}
