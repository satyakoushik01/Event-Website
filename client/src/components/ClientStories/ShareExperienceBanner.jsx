import React from 'react';
import { FaPen, FaRegCalendarAlt } from 'react-icons/fa';
import './clientStories.css';

export default function ShareExperienceBanner({ onShareStory }) {
  return (
    <div className="share-experience-banner">
      <div className="banner-content">
        <h3 className="banner-title">Share Your Experience</h3>
        <p className="banner-text">
          Your celebration deserves to be remembered.<br />
          Tell us what your moment meant to you.
        </p>
        <div className="banner-buttons">
          <button type="button" className="cta-button cta-primary" onClick={onShareStory}>
            <FaPen /> Share your Story
          </button>
          <button
            type="button"
            className="cta-button cta-secondary"
            onClick={() => (window.location.href = '/planner')}
          >
            <FaRegCalendarAlt /> Book Your Next Moment
          </button>
        </div>
      </div>
      <div className="banner-script">Every Moment<br />Now a Day</div>
    </div>
  );
}
