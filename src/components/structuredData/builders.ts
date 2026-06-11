/**
 * JSON-LD node builders. Each returns a plain schema.org node object; compose
 * them into a single `@graph` per page with `buildGraph(...)`. Nodes reference
 * the shared Person/WebSite by `@id` rather than duplicating them.
 *
 * Template → builder mapping:
 *   /                       → homePageNode            (WebPage)
 *   /archive                → archiveCollectionNode   (CollectionPage + ItemList)
 *   /article/[slug]         → articleNode             (BlogPosting)
 *   /philosophy             → profilePageNode         (ProfilePage)
 *   /portfolio-row/[slug]   → portfolioRowCollectionNode (CollectionPage + ItemList<CreativeWork>)
 *   (any nested page)       → breadcrumbNode          (BreadcrumbList)
 */
import {
  PERSON,
  PERSON_ID,
  WEBSITE_ID,
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  absoluteUrl,
} from "./config";

export type JsonLdNode = Record<string, unknown>;

/** Drop keys whose value is undefined/null/empty so nodes stay clean. */
function compact(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(([, v]) => {
      if (v === undefined || v === null) return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }),
  );
}

/* ------------------------------------------------------------------ */
/* Shared global nodes (include on every page)                         */
/* ------------------------------------------------------------------ */

export function personNode(): JsonLdNode {
  return compact({
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    alternateName: PERSON.alternateName,
    url: SITE_URL,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    email: `mailto:${PERSON.email}`,
    knowsAbout: PERSON.knowsAbout,
    sameAs: PERSON.sameAs,
  });
}

export function webSiteNode(): JsonLdNode {
  return compact({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LOCALE,
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  });
}

export interface BreadcrumbItem {
  name: string;
  /** Path or absolute URL. */
  url: string;
}

export function breadcrumbNode(trail: BreadcrumbItem[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Per-template page nodes                                             */
/* ------------------------------------------------------------------ */

/** `/` — homepage. Optionally lists the portfolio rows as an ItemList. */
export function homePageNode(input?: {
  rows?: { name: string; url: string }[];
}): JsonLdNode {
  return compact({
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    inLanguage: SITE_LOCALE,
    hasPart: input?.rows?.length
      ? {
          "@type": "ItemList",
          itemListElement: input.rows.map((row, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: row.name,
            url: absoluteUrl(row.url),
          })),
        }
      : undefined,
  });
}

/** `/archive` — article listing. */
export function archiveCollectionNode(input: {
  path: string;
  name: string;
  description?: string;
  articles: { name: string; url: string; datePublished?: string }[];
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  return compact({
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE_LOCALE,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.articles.map((article, i) =>
        compact({
          "@type": "ListItem",
          position: i + 1,
          name: article.name,
          url: absoluteUrl(article.url),
        }),
      ),
    },
  });
}

/** `/article/[slug]` — single article. */
export function articleNode(input: {
  /** Canonical path or full slug (e.g. "/article/foo"). */
  path: string;
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  const images = (Array.isArray(input.image) ? input.image : [input.image])
    .filter((src): src is string => Boolean(src))
    .map((src) => absoluteUrl(src));

  return compact({
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: input.headline,
    description: input.description,
    image: images,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@id": PERSON_ID },
    publisher: { "@id": WEBSITE_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE_LOCALE,
  });
}

/** `/philosophy` — about/profile page. */
export function profilePageNode(input: {
  path: string;
  name: string;
  description?: string;
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  return compact({
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    inLanguage: SITE_LOCALE,
  });
}

export interface CreativeWorkInput {
  name: string;
  url?: string;
  description?: string;
  image?: string;
  year?: number | string;
  technologies?: string[];
}

/** A single portfolio project — reused for row list items and a future detail page. */
export function creativeWorkNode(input: CreativeWorkInput): JsonLdNode {
  return compact({
    "@type": "CreativeWork",
    name: input.name,
    url: input.url ? absoluteUrl(input.url) : undefined,
    description: input.description,
    image: input.image ? absoluteUrl(input.image) : undefined,
    dateCreated: input.year ? String(input.year) : undefined,
    keywords: input.technologies?.length
      ? input.technologies.join(", ")
      : undefined,
    creator: { "@id": PERSON_ID },
  });
}

/** `/portfolio-row/[slug]` — curated collection of projects. */
export function portfolioRowCollectionNode(input: {
  path: string;
  name: string;
  description?: string;
  items: CreativeWorkInput[];
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  return compact({
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: SITE_LOCALE,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: creativeWorkNode(item),
      })),
    },
  });
}

/* ------------------------------------------------------------------ */
/* Graph assembly                                                      */
/* ------------------------------------------------------------------ */

type GraphInput = JsonLdNode | JsonLdNode[] | null | undefined | false;

/** Wrap one or more nodes in a single schema.org document. */
export function buildGraph(...nodes: GraphInput[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes
      .flat()
      .filter((node): node is JsonLdNode => Boolean(node)),
  };
}
