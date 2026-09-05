import { motion } from "framer-motion";
import React from "react";

export default function ClientStoryCard({ story, isHovered = false, onClick }) {
  if (!story) return null;

  return (
    <motion.div
      className="client-story-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        height: "100%",
      }}
    >
      {/* Image */}
      {story.image && (
        <div
          style={{
            width: "100%",
            height: "240px",
            overflow: "hidden",
          }}
        >
          <img
            src={story.image}
            alt={story.name || story.title || "Client story"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "20px" }}>
        {story.name && (
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {story.name}
          </h3>
        )}

        {story.title && (
          <h4
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {story.title}
          </h4>
        )}

        {story.event && (
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "14px",
              opacity: 0.7,
            }}
          >
            {story.event}
          </p>
        )}

        {story.testimonial && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              lineHeight: 1.6,
              opacity: 0.85,
            }}
          >
            "{story.testimonial}"
          </p>
        )}

        {story.description && !story.testimonial && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              lineHeight: 1.6,
              opacity: 0.85,
            }}
          >
            {story.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}