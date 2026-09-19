import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Simple email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ShareStorySection = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    fullName: '',
    eventDate: '',
    story: '',
    photos: [],
    videoLink: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Your name is required';
    if (!formData.eventDate.trim()) newErrors.eventDate = 'Event date is required';
    if (!formData.story.trim()) newErrors.story = 'Story is required';
    if (formData.videoLink && !/^https?:\/\/.+/.test(formData.videoLink)) newErrors.videoLink = 'Enter a valid URL';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    // Reset form after a short delay (optional)
  };

  return (
    <section className="share-story-section" id="share-story-section">
      <h2 className="share-heading">YOUR MOMENT. YOUR VOICE.</h2>
      <p className="share-subheading">Share Your Unforgettable Experience</p>
      {submitted ? (
        <div className="share-success">
          <h3>Thank you for sharing your story.</h3>
        </div>
      ) : (
        <form className="share-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventName">Event Name</label>
              <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleChange} className={errors.eventName ? 'error' : ''} placeholder="Event Name" />
              {errors.eventName && <span className="error-msg">{errors.eventName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Your Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={errors.fullName ? 'error' : ''} placeholder="Your Full Name" />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date</label>
              <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} className={errors.eventDate ? 'error' : ''} />
              {errors.eventDate && <span className="error-msg">{errors.eventDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="videoLink">Add a Video Link</label>
              <input type="url" id="videoLink" name="videoLink" value={formData.videoLink} onChange={handleChange} className={errors.videoLink ? 'error' : ''} placeholder="https://..." />
              {errors.videoLink && <span className="error-msg">{errors.videoLink}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="story">Your Story</label>
            <textarea id="story" name="story" rows={5} value={formData.story} onChange={handleChange} className={errors.story ? 'error' : ''} placeholder="Your Story"></textarea>
            {errors.story && <span className="error-msg">{errors.story}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="photos">Upload Photos</label>
            <input type="file" id="photos" name="photos" multiple accept="image/*" onChange={handlePhotoSelect} />
            {/* Optional preview thumbnails */}
            {formData.photos.length > 0 && (
              <div className="photo-preview">
                {formData.photos.map((file, idx) => (
                  <img key={idx} src={URL.createObjectURL(file)} alt={`preview-${idx}`} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="share-submit-btn">Submit</button>
        </form>
      )}
      {/* Decorative photo stack */}
      <div className="photo-stack">
        <div className="photo-card photo-card-1"><span>Photo 1</span></div>
        <div className="photo-card photo-card-2"><span>Photo 2</span></div>
        <div className="photo-card photo-card-3"><span>Your Photo Here</span></div>
      </div>
    </section>
  );
};

export default ShareStorySection;
