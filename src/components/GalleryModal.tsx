"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../app/styles/galleryModal.css";

export interface GalleryImage {
  url: string;
  thumbUrl: string;
  alt: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  title: string;
}

export default function GalleryModal({ images, title }: GalleryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const uid = useId().replace(/:/g, "");
  const titleId = `gallery-dialog-title-${uid}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  // Move focus into the dialog on open; restore to trigger on close
  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // ESC to close + Tab focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  if (images.length === 0) return null;

  const selected = images[selectedIndex];

  function open() {
    setSelectedIndex(0);
    setIsOpen(true);
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="galleryModal__trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={open}
      >
        See more images
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="galleryModal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="galleryModal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="galleryModal__header">
                <h3 id={titleId} className="galleryModal__title">{title}</h3>
                <div className="galleryModal__header-right">
                  <span className="galleryModal__counter" aria-live="polite" aria-atomic="true">
                    {selectedIndex + 1} / {images.length}
                  </span>
                  <button
                    ref={closeRef}
                    className="galleryModal__close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close gallery"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="galleryModal__body">
                <div className="galleryModal__preview">
                  <div className="galleryModal__preview-wrapper">
                    <Image
                      key={selected.url}
                      src={selected.url}
                      alt={selected.alt}
                      fill
                      className="galleryModal__preview-image"
                    />
                  </div>
                </div>

                <div className="galleryModal__thumbnails">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`galleryModal__thumb${i === selectedIndex ? " galleryModal__thumb--active" : ""}`}
                      onClick={() => setSelectedIndex(i)}
                      aria-label={`View image ${i + 1} of ${images.length}`}
                      aria-pressed={i === selectedIndex}
                    >
                      <div className="galleryModal__thumb-wrapper">
                        <Image
                          src={img.thumbUrl}
                          alt=""
                          fill
                          className="galleryModal__thumb-image"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
