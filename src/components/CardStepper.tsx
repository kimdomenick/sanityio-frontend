"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import "@/app/styles/CardStepper.css";

interface CardStepperProps {
  children: React.ReactNode;
}

export default function CardStepper({ children }: CardStepperProps) {
  const items = React.Children.toArray(children);
  const total = items.length;
  const [current, setCurrent] = useState(0);

  if (total === 0) return null;
  if (total === 1)
    return (
      <div className="card-stepper">
        <div className="card-stepper__card">{items[0]}</div>
      </div>
    );

  const go = (dir: 1 | -1) => {
    setCurrent((prev) => prev + dir);
  };

  return (
    <div className="card-stepper">
      <div className="card-stepper__card">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="card-stepper__slot"
            animate={{
              opacity: i === current ? 1 : 0,
              x: (i - current) * 40,
              zIndex: i === current ? 1 : 0,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            aria-hidden={i !== current || undefined}
            {...(i !== current ? ({ inert: true } as object) : {})}
          >
            {item}
          </motion.div>
        ))}
      </div>

      <div className="card-stepper__controls">
        <button
          className="card-stepper__btn"
          onClick={() => go(-1)}
          disabled={current === 0}
          aria-label="Previous"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span
          className="card-stepper__count"
          aria-live="polite"
          aria-atomic="true"
        >
          {current + 1} / {total}
        </span>

        <button
          className="card-stepper__btn"
          onClick={() => go(1)}
          disabled={current === total - 1}
          aria-label="Next"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
