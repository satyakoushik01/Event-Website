import React, { useState } from 'react';
import HeroCarousel from '../components/ClientStories/HeroCarousel';
import StoryFilterBar from '../components/ClientStories/StoryFilterBar';
import StoryGrid from '../components/ClientStories/StoryGrid';
import ShareExperienceBanner from '../components/ClientStories/ShareExperienceBanner';
import SubmissionForm from '../components/ClientStories/SubmissionForm';
import '../components/ClientStories/clientStories.css';
import { clientStories } from '../data/clientStoriesData';

export default function ClientStoriesPage() {
  const [filter, setFilter] = useState('All');
  const [showSubmission, setShowSubmission] = useState(false);

  const filteredStories =
    filter === 'All'
      ? clientStories
      : clientStories.filter(
          (story) => story.category.toLowerCase() === filter.toLowerCase()
        );

  const openSubmission = () => {
    setShowSubmission(true);
    window.setTimeout(() => {
      document
        .getElementById('share-story-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <main className="client-stories-page">
      <section className="cs-hero">
        <div className="cs-kicker">GLIPHY STORIES</div>
        <h1 className="cs-hero-title">Real moments. Real celebrations.</h1>
        <p className="cs-hero-subtitle">Stories shared by the people who lived them.</p>

        <section className="hero-section" aria-label="Featured client stories">
          <HeroCarousel stories={clientStories} />
        </section>
      </section>

      <section className="explore-section">
        <h2 className="section-title">Explore More Stories</h2>
        <StoryFilterBar active={filter} setActive={setFilter} />
        <StoryGrid stories={filteredStories} />
      </section>

      <section className="cta-banner">
        <ShareExperienceBanner onShareStory={openSubmission} />
      </section>

      {showSubmission && (
        <section className="submission-section" id="share-story-section">
          <div className="submission-heading">
            <div className="cs-kicker">GLIPHY STORIES</div>
            <h2 className="submission-title">YOUR MOMENT. YOUR VOICE.</h2>
            <p className="submission-subtitle">Share Your Unforgettable Experience</p>
          </div>
          <SubmissionForm />
        </section>
      )}
    </main>
  );
}
