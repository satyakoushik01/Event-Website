import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Ensure the modal is attached to the app element for accessibility
if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root');
}

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ShareStoryModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email.';
    if (!formData.type.trim()) newErrors.type = 'Story type is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // In a real app we'd send data to backend. Here we just show success.
    setSubmitted(true);
  };

  const closeModal = () => {
    // Reset state when closing
    setFormData({ name: '', email: '', type: '', message: '' });
    setErrors({});
    setSubmitted(false);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Share Your Story"
      className="client-stories-page__share-modal"
      overlayClassName="client-stories-page__share-modal-overlay"
    >
      <button className="client-stories-page__modal-close" onClick={closeModal} aria-label="Close modal">
        <FaTimes size={20} />
      </button>
      {!submitted ? (
        <form className="client-stories-page__share-form" onSubmit={handleSubmit} noValidate>
          <h2 className="client-stories-page__share-title">Share Your Story</h2>
          <div className="client-stories-page__form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="client-stories-page__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className="client-stories-page__form-group">
            <label htmlFor="type">Event / Story Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? 'error' : ''}
            />
            {errors.type && <span className="error-msg">{errors.type}</span>}
          </div>
          <div className="client-stories-page__form-group">
            <label htmlFor="message">Message / Story</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-msg">{errors.message}</span>}
          </div>
          <button type="submit" className="client-stories-page__submit-btn">
            Submit
          </button>
        </form>
      ) : (
        <div className="client-stories-page__thank-you">
          <h2>Thank you!</h2>
          <p>Your story has been received. We’ll review it shortly.</p>
          <button onClick={closeModal} className="client-stories-page__close-btn">
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ShareStoryModal;
