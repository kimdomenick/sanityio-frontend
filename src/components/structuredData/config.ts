/**
 * Site-wide constants and helpers shared by every structured-data builder.
 *
 * Structured data requires ABSOLUTE urls for `@id`, `url`, and `image`.
 * `NEXT_PUBLIC_SITE_URL` can override the base URL per environment; it
 * defaults to the production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rosecoloredcode.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Rose Colored Code";

export const SITE_DESCRIPTION =
  "A technical and creative portfolio by web developer and technical writer, Kim Rosenberry";

export const SITE_LOCALE = "en";

/** The central real-world entity this site is about. */
export const PERSON = {
  name: "Kim Rosenberry",
  alternateName: "Kimberly Rosenberry",
  jobTitle: "Frontend Developer",
  description:
    "Frontend Developer • Systems Analyst • Technical Writer • UX Collaborator",
  email: "kim.domenick@gmail.com",
  knowsAbout: [
    "Frontend Development",
    "Web Development",
    "Technical Writing",
    "Systems Analysis",
    "User Experience",
  ],
  // Profile URLs that confirm identity (helps Google build a knowledge panel).
  sameAs: [
    "https://www.linkedin.com/in/kimberly-domenick-1505a9103/",
    "https://github.com/kimdomenick",
    "https://codepen.io/kdomenick/pens/public",
  ],
};

/** Stable @ids so nodes can cross-reference each other within a page's @graph. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Resolve a path or already-absolute URL to an absolute URL. */
export function absoluteUrl(path = "/"): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Coerce a date-ish value to an ISO 8601 string (what Google expects). */
export function toISODate(value?: string | number | Date): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
