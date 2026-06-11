import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITE_URL } from "@/components/structuredData";

type SlugDoc = { slug: string; updated?: string };

// article slug.current is stored as a full path (e.g. "/article/foo"); portfolio
// row slug.current is a bare slug, so it gets the "/portfolio-row/" prefix.
const ARTICLES_QUERY = `*[
  _type == "article" && defined(slug.current)
]{ "slug": slug.current, "updated": _updatedAt }`;

const ROWS_QUERY = `*[
  _type == "portfolioRow"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
]{ "slug": slug.current, "updated": _updatedAt }`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, rows] = await Promise.all([
    client.fetch<SlugDoc[]>(ARTICLES_QUERY),
    client.fetch<SlugDoc[]>(ROWS_QUERY),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/archive`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/philosophy`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((doc) => ({
    url: `${SITE_URL}${doc.slug.startsWith("/") ? "" : "/"}${doc.slug}`,
    lastModified: doc.updated ? new Date(doc.updated) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const rowRoutes: MetadataRoute.Sitemap = rows.map((doc) => ({
    url: `${SITE_URL}/portfolio-row/${doc.slug}`,
    lastModified: doc.updated ? new Date(doc.updated) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...rowRoutes];
}
