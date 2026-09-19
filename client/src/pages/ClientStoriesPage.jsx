import React, { useState } from 'react';
import FeaturedStory from '../components/ClientStories/FeaturedStory';
import StoryFilters from '../components/ClientStories/StoryFilters';
import StoryGrid from '../components/ClientStories/StoryGrid';
import WatchStoryModal from '../components/ClientStories/WatchStoryModal';
import ShareStorySection from '../components/ClientStories/ShareStorySection';
import '../components/ClientStories/ShareStorySection.css';
import { FaPen, FaCalendar } from 'react-icons/fa';
import '../components/ClientStories/clientStories.css';

// Example placeholder stories – random images and names
const exampleStories = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Celebration ${i + 1}`,
  author: ['Emily Johnson', 'Liam Patel', 'Sofia Martinez', 'Noah Kim', 'Ava Chen', 'Ethan Singh'][i % 6],
  category: ['Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Festival', 'Graduation'][i % 6],
  image: `https://picsum.photos/seed/story${i + 1}/800/500`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel.',
  videoPlaceholder: `https://picsum.photos/seed/video${i + 1}/800/450`,
}));

export default function ClientStoriesPage() {
  const [activeStory, setActiveStory] = useState(exampleStories[0]);
  const [filter, setFilter] = useState('All');
  const [watchOpen, setWatchOpen] = useState(false);

  const filteredStories =
    filter === 'All'
      ? exampleStories
      : exampleStories.filter((s) => s.category.toUpperCase() === filter.toUpperCase());

  const handleCardClick = (story) => {
    setActiveStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="client-stories-page">
      {/* Hero */}
      <section className="hero text-center py-12">
        <div className="hero-badge">— CLIENT STORIES —</div>
        <h1 className="hero-title">Real moments. Real celebrations.</h1>
        <p className="hero-subtitle">Stories shared by the people who lived them.</p>
      </section>

      {/* Featured Open Book */}
      <FeaturedStory
        story={activeStory}
        onPrev={() => {
          const idx = exampleStories.findIndex((s) => s.id === activeStory.id);
          setActiveStory(exampleStories[(idx - 1 + exampleStories.length) % exampleStories.length]);
        }}
        onNext={() => {
          const idx = exampleStories.findIndex((s) => s.id === activeStory.id);
          setActiveStory(exampleStories[(idx + 1) % exampleStories.length]);
        }}
        openWatch={() => setWatchOpen(true)}
        counter={`${exampleStories.findIndex((s) => s.id === activeStory.id) + 1} / ${exampleStories.length} Stories`}
      />

      {/* Watch Modal */}
      <WatchStoryModal isOpen={watchOpen} onClose={() => setWatchOpen(false)} story={activeStory} />

      {/* Explore More Stories */}
      <section className="explore py-12">
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#f5f5f5' }}>
          Explore More Stories
        </h2>
        <StoryFilters active={filter} setActive={setFilter} />
        <StoryGrid stories={filteredStories} onCardClick={handleCardClick} />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-left">
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>
            Share Your Experience
          </h3>
          <p className="mb-4" style={{ color: '#b0b0b0' }}>
            Your celebration deserves to be remembered. Tell us what your moment meant to you.
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button cta-primary"
              onClick={() => {
                const el = document.getElementById('share-story-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <FaPen /> Share Your Story
            </button>
            <button className="cta-button cta-secondary" onClick={() => (window.location.href = '/planner')}>
              <FaCalendar /> Plan Your Next Moment
            </button>
          </div>
        </div>
        <div className="cta-right">Every Moment Has A Story</div>
      </section>

      {/* Share Story Section */}
      <ShareStorySection />
    </div>
  );
}
