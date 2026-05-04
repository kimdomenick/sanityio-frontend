"use client";

import Image from "next/image";
import { useState } from "react";
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

  if (images.length === 0) return null;

  const selected = images[selectedIndex];

  function open() {
    setSelectedIndex(0);
    setIsOpen(true);
  }

  return (
    <>
      <button className="galleryModal__trigger" type="button" onClick={open}>
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
              className="galleryModal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="galleryModal__header">
                <h3 className="galleryModal__title">{title}</h3>
                <div className="galleryModal__header-right">
                  <span className="galleryModal__counter">
                    {selectedIndex + 1} / {images.length}
                  </span>
                  <button
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
                      aria-label={`View image ${i + 1}`}
                    >
                      <div className="galleryModal__thumb-wrapper">
                        <Image
                          src={img.thumbUrl}
                          alt={img.alt}
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
