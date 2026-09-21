import React from 'react';
import './clientStories.css';
import { resolveStoryImage } from './storyImage';

export default function StoryGrid({ stories }) {
  return (
    <div className="story-grid">
      {stories.map((story) => (
        <article className="grid-card" key={story.id}>
          <div className="grid-image">
            <img
              src={resolveStoryImage(story)}
              alt={story.names}
              loading="lazy"
              onError={(event) => {
                const fallback = resolveStoryImage(story, true);
                if (fallback && event.currentTarget.src !== fallback) {
                  event.currentTarget.src = fallback;
                } else {
                  event.currentTarget.style.display = 'none';
                }
              }}
            />
            <span className="grid-play" aria-hidden="true">▶</span>
          </div>
          <div className="grid-info">
            <h3 className="grid-title">{story.names}</h3>
            <div className="grid-meta">
              <span>{story.category}</span>
              {story.location && <><span>•</span><span>{story.location}</span></>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
