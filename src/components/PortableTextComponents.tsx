import Link from "next/link";
import { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 leading-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base sm:text-lg lg:text-xl font-bold mb-6 leading-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm sm:text-base lg:text-lg font-bold mb-6 leading-tight">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";

      // Check if it's an internal link
      const isInternal = href.startsWith("/") || href.startsWith("#");

      if (isInternal) {
        return (
          <Link href={href}>
            {children}
          </Link>
        );
      }

      // External link
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
  },
};