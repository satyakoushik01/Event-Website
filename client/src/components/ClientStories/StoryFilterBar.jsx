import React from 'react';
import './clientStories.css';

const categories = [
  ['All', 'All'],
  ['Weddings', 'WEDDING'],
  ['Birthdays', 'BIRTHDAY'],
  ['Corporate', 'CORPORATE'],
  ['Engagements', 'ENGAGEMENT'],
  ['Destinations', 'DESTINATION'],
];

export default function StoryFilterBar({ active, setActive }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Story categories">
      {categories.map(([label, value]) => (
        <button
          key={label}
          type="button"
          className={`filter-pill ${active === value ? 'active' : ''}`}
          onClick={() => setActive(value)}
          role="tab"
          aria-selected={active === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
