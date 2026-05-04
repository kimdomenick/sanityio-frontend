"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useId } from "react";
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
  const uid = useId().replace(/:/g, "");
  const titleId = `row-card-dialog-title-${uid}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  // Move focus into the dialog on open; restore it to the trigger on close
  useEffect(() => {
    if (isExpanded) {
      closeRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [isExpanded]);

  // ESC to close + Tab focus trap
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

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
            <ul className="portfolioRowCard__technologies">
              {technologies.map((tech, index) => (
                <li key={index} className="portfolioRowCard__tech-tag">
                  {tech}
                </li>
              ))}
            </ul>
          )}
          <div className="portfolioRowCard__footer">
            {href ? (
              <Link href={href} className="portfolioRowCard__button">
                View Details
              </Link>
            ) : (
              <button
                ref={triggerRef}
                className="portfolioRowCard__button"
                type="button"
                aria-haspopup="dialog"
                onClick={() => setIsExpanded(true)}
              >
                View Details
              </button>
            )}
            {year && <time className="portfolioRowCard__year" dateTime={year}>{year}</time>}
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
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="portfolioRowCard__modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                className="portfolioRowCard__modal-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close dialog"
              >
                ×
              </button>

              <div className="portfolioRowCard__modal-image-wrapper">
                <Image src={image} alt="" fill className="portfolioRowCard__image" />
              </div>

              <div className="portfolioRowCard__modal-content">
                <div className="portfolioRowCard__modal-header">
                  <h2 id={titleId} className="portfolioRowCard__modal-title">
                    {title}
                  </h2>
                  {year && (
                    <time className="portfolioRowCard__modal-year" dateTime={year}>{year}</time>
                  )}
                </div>

                <p className="portfolioRowCard__modal-description">
                  {description}
                </p>

                {details && (
                  <div className="portfolioRowCard__modal-details">
                    <h3>Project Details</h3>
                    <p>{details}</p>
                  </div>
                )}

                {technologies.length > 0 && (
                  <div className="portfolioRowCard__modal-technologies">
                    <h3>Technologies Used</h3>
                    <ul className="portfolioRowCard__tech-list">
                      {technologies.map((tech, index) => (
                        <li key={index} className="portfolioRowCard__tech-tag">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolioRowCard__modal-link"
                    aria-label="View Project (opens in new tab)"
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
