import React from 'react';
import ReactModal from 'react-modal';
import { FaTimes, FaPlay } from 'react-icons/fa';

export default function WatchStoryModal({ isOpen, onClose, story }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Watch Story"
      className="watch-modal"
      overlayClassName="watch-modal-overlay"
    >
      <button className="modal-close" onClick={onClose}><FaTimes size={20} /></button>
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <img src={story.image} alt={story.names} style={{ maxWidth: '100%', borderRadius: '0.5rem' }} />
        <div className="placeholder" style={{ marginTop: '1rem', fontSize: '1.25rem', color: '#d4af37' }}>
          <FaPlay /> Story video coming soon
        </div>
      </div>
    </ReactModal>
  );
}
