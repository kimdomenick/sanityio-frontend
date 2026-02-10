"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  title?: string;
}

export default function HorizontalScrollSection({
  children,
  title,
}: HorizontalScrollSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;

    setScrollProgress(progress);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - 1);

    // Hide scroll hint after user scrolls
    if (scrollLeft > 50 && showScrollHint) {
      setShowScrollHint(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of viewport width
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    handleScroll(); // Initial check
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="horizontal-scroll-section">
      {title && <h2 className="horizontal-scroll-section__title">{title}</h2>}

      <div className="horizontal-scroll-section__wrapper">
        {/* Scroll Hint */}
        {showScrollHint && (
          <motion.div
            className="horizontal-scroll-section__hint"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span>Scroll to explore →</span>
            </motion.div>
          </motion.div>
        )}

        {/* Left Navigation Arrow */}
        <motion.button
          className="horizontal-scroll-section__nav horizontal-scroll-section__nav--left"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0.3 }}
          whileHover={{ scale: canScrollLeft ? 1.1 : 1 }}
          whileTap={{ scale: canScrollLeft ? 0.9 : 1 }}
          aria-label="Scroll left"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </motion.button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="horizontal-scroll-container"
        >
          <div className="horizontal-scroll-content">{children}</div>
        </div>

        {/* Right Navigation Arrow */}
        <motion.button
          className="horizontal-scroll-section__nav horizontal-scroll-section__nav--right"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0.3 }}
          whileHover={{ scale: canScrollRight ? 1.1 : 1 }}
          whileTap={{ scale: canScrollRight ? 0.9 : 1 }}
          aria-label="Scroll right"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </motion.button>
      </div>

      {/* Progress Indicator */}
      <div className="horizontal-scroll-section__progress-wrapper">
        <div className="horizontal-scroll-section__progress-bar">
          <motion.div
            className="horizontal-scroll-section__progress-fill"
            style={{ width: `${scrollProgress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="horizontal-scroll-section__progress-text">
          Scroll to explore {Math.round(scrollProgress)}% viewed
        </div>
      </div>
    </div>
  );
}
