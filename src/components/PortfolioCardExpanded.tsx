"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "../app/styles/portfolioCard.css";

interface PortfolioCardExpandedProps {
  title: string;
  image: string;
  description: string;
  year?: string;
  technologies?: string[];
  details?: string;
  link?: string;
}

export default function PortfolioCardExpanded({
  title,
  image,
  description,
  year,
  technologies = [],
  details,
  link,
}: PortfolioCardExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.article
        className="portfolioCard"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="portfolioCard__imageWrapper">
          <Image
            src={image}
            alt={title}
            fill
            className="portfolioCard__image"
          />
        </div>
        <div className="portfolioCard__content">
          <div className="portfolioCard__header">
            <h3 className="portfolioCard__title">{title}</h3>
            {year && <span className="portfolioCard__year">{year}</span>}
          </div>
          <p className="portfolioCard__description">{description}</p>
          {technologies.length > 0 && (
            <div className="portfolioCard__technologies">
              {technologies.map((tech, index) => (
                <span key={index} className="portfolioCard__tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
          <button
            className="portfolioCard__button"
            type="button"
            onClick={() => setIsExpanded(true)}
          >
            View Details
          </button>
        </div>
      </motion.article>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="portfolioCard__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="portfolioCard__modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="portfolioCard__modal-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close modal"
              >
                ×
              </button>

              <div className="portfolioCard__modal-image-wrapper">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="portfolioCard__image"
                />
              </div>

              <div className="portfolioCard__modal-content">
                <div className="portfolioCard__modal-header">
                  <h2 className="portfolioCard__modal-title">{title}</h2>
                  {year && (
                    <span className="portfolioCard__modal-year">{year}</span>
                  )}
                </div>

                <p className="portfolioCard__modal-description">
                  {description}
                </p>

                {details && (
                  <div className="portfolioCard__modal-details">
                    <h4>Project Details</h4>
                    <p>{details}</p>
                  </div>
                )}

                {technologies.length > 0 && (
                  <div className="portfolioCard__modal-technologies">
                    <h4>Technologies Used</h4>
                    <div className="portfolioCard__tech-list">
                      {technologies.map((tech, index) => (
                        <span key={index} className="portfolioCard__tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolioCard__modal-link"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
