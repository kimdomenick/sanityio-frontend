/**
 * Sanity documents are intentionally loosely typed here — GROQ projections vary
 * per query and we don't generate types from the schema. A permissive record
 * keeps call sites simple; this is the one sanctioned use of `any` for that.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityDocument = Record<string, any>;
