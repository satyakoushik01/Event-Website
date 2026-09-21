import React from 'react';

const SubmissionForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    window.alert('Thank you for sharing your story.');
  };

  return (
    <div className="submission-layout">
      <form className="submission-form" onSubmit={handleSubmit}>
        <div className="submission-form-grid">
          <div className="form-field">
            <label htmlFor="event-name">Event Name</label>
            <input id="event-name" type="text" name="eventName" placeholder="Event Name" />
          </div>

          <div className="form-field">
            <label htmlFor="full-name">Your Full Name</label>
            <input id="full-name" type="text" name="fullName" placeholder="Your Full Name" />
          </div>

          <div className="form-field">
            <label htmlFor="event-date">Event Date</label>
            <input id="event-date" type="date" name="eventDate" />
          </div>

          <div className="form-field">
            <label htmlFor="story">Your Story</label>
            <textarea id="story" name="story" placeholder="Your Story" />
          </div>

          <div className="upload-row">
            <label className="upload-box">
              <strong>◉ Upload Photos</strong>
              <br />
              Upload photos and want to the photos.
              <input type="file" name="photos" accept="image/*" multiple />
            </label>

            <label className="upload-box">
              <strong>▶ Add a Video Link</strong>
              <br />
              Add a Video link to prevent a Video Link.
              <input type="url" name="videoLink" placeholder="https://..." />
            </label>
          </div>

          <button className="submit-form-btn" type="submit">
            Submit
          </button>
        </div>
      </form>

      <div className="submission-art" aria-hidden="true">
        <div className="photo-stack">Your Photo Here</div>
      </div>
    </div>
  );
};

export default SubmissionForm;
