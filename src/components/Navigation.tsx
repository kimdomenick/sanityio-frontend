"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Writing Archive" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul className="flex gap-4">
        {navigationItems.map(({ href, label }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));

          return (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-3 rounded transition-colors ${
                  isActive ? "bg-gray-900 text-white" : "conic-button"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
