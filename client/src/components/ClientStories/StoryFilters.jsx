import React from 'react';

// Define display labels (plural) and underlying filter values (singular)
const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Weddings', value: 'Wedding' },
  { label: 'Birthdays', value: 'Birthday' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Engagements', value: 'Engagement' },
  { label: 'Destinations', value: 'Destination' },
];

export default function StoryFilters({ active, setActive }) {
  return (
    <div className="filters">
      {filterOptions.map(opt => (
        <button
          key={opt.label}
          className={`filter-btn ${active === opt.value ? 'active' : 'inactive'}`}
          onClick={() => setActive(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
