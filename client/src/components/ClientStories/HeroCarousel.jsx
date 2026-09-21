import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import './clientStories.css';
import { resolveStoryImage } from './storyImage';

export default function HeroCarousel({ stories }) {
  return (
    <Swiper
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      loop={stories.length > 2}
      coverflowEffect={{
        rotate: 0,
        stretch: -20,
        depth: 180,
        modifier: 1.2,
        slideShadows: false,
      }}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination, EffectCoverflow]}
      className="hero-carousel"
    >
      {stories.map((story) => (
        <SwiperSlide key={story.id} className="hero-slide">
          <article className="carousel-card">
            <div className="carousel-image">
              <img
                src={resolveStoryImage(story)}
                alt={story.names}
                onError={(event) => {
                  const fallback = resolveStoryImage(story, true);
                  if (fallback && event.currentTarget.src !== fallback) {
                    event.currentTarget.src = fallback;
                  } else {
                    event.currentTarget.style.display = 'none';
                  }
                }}
              />
            </div>

            <div className="carousel-details">
              <div>
                <div className="category">{story.category}</div>
                <h3 className="carousel-title">{story.names}</h3>
                <p className="carousel-tagline">{story.tagline}</p>
                {story.location && (
                  <div className="location">
                    <span>⌖</span> {story.location}
                  </div>
                )}
                {story.quote && (
                  <blockquote className="carousel-quote">“{story.quote}”</blockquote>
                )}
              </div>

              <div>
                <div className="carousel-rating" aria-label={`${story.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index} className={index < story.rating ? 'star filled' : 'star'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="carousel-author">{story.author}</p>
              </div>
            </div>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
