"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "../app/styles/portfolioRowCard.css";

interface PortfolioRowCardExpandedProps {
  title: string;
  image: string;
  description: string;
  year?: string;
  technologies?: string[];
  details?: string;
  link?: string;
  href?: string;
}

export default function PortfolioRowCardExpanded({
  title,
  image,
  description,
  year,
  technologies = [],
  details,
  link,
  href,
}: PortfolioRowCardExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.article
        className="portfolioRowCard"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="portfolioRowCard__imageWrapper">
          <Image
            src={image}
            alt={title}
            fill
            className="portfolioRowCard__image"
          />
        </div>
        <div className="portfolioRowCard__content">
          <h4 className="portfolioRowCard__title">{title}</h4>
          <p className="portfolioRowCard__description">{description}</p>
          {technologies.length > 0 && (
            <div className="portfolioRowCard__technologies">
              {technologies.map((tech, index) => (
                <span key={index} className="portfolioRowCard__tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="portfolioRowCard__footer">
            {href ? (
              <Link href={href} className="portfolioRowCard__button">
                View Details
              </Link>
            ) : (
              <button
                className="portfolioRowCard__button"
                type="button"
                onClick={() => setIsExpanded(true)}
              >
                View Details
              </button>
            )}

            {year && <span className="portfolioRowCard__year">{year}</span>}
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="portfolioRowCard__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="portfolioRowCard__modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="portfolioRowCard__modal-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close modal"
              >
                ×
              </button>

              <div className="portfolioRowCard__modal-image-wrapper">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="portfolioRowCard__image"
                />
              </div>

              <div className="portfolioRowCard__modal-content">
                <div className="portfolioRowCard__modal-header">
                  <h2 className="portfolioRowCard__modal-title">{title}</h2>
                  {year && (
                    <span className="portfolioRowCard__modal-year">{year}</span>
                  )}
                </div>

                <p className="portfolioRowCard__modal-description">
                  {description}
                </p>

                {details && (
                  <div className="portfolioRowCard__modal-details">
                    <h4>Project Details</h4>
                    <p>{details}</p>
                  </div>
                )}

                {technologies.length > 0 && (
                  <div className="portfolioRowCard__modal-technologies">
                    <h4>Technologies Used</h4>
                    <div className="portfolioRowCard__tech-list">
                      {technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="portfolioRowCard__tech-tag"
                        >
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
                    className="portfolioRowCard__modal-link"
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
