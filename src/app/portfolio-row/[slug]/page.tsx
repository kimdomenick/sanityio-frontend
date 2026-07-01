import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import type { SanityDocument } from "@/sanity/types";
import { portableTextComponents } from "@/components/PortableTextComponents";
import GalleryModal, { type GalleryImage } from "@/components/GalleryModal";
import {
  StructuredData,
  personNode,
  webSiteNode,
  portfolioRowCollectionNode,
  breadcrumbNode,
} from "@/components/structuredData";
import "@/app/styles/pages/portfolioRow.css";

const ROW_QUERY = `*[
  _type == "portfolioRow"
  && slug.current == $slug
  && !(_id in path("drafts.**"))
][0] {
  _id,
  name,
  blurb,
  description,
  "portfolioItems": portfolioItems[]->{
    _id,
    title,
    slug,
    year,
    shortDescription,
    body,
    image,
    gallery[]{
      asset,
      alt
    },
    "technologies": portfolioCategory[]->title
  }
}`;

const ALL_ROWS_QUERY = `*[
  _type == "portfolioRow"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
]{ "slug": slug.current }`;

// Ordered list of rows for prev/next pagination — matches the home page order.
const ROW_NAV_QUERY = `*[
  _type == "portfolioRow"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
] | order(sortOrder asc) {
  "slug": slug.current,
  name
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export async function generateStaticParams() {
  const rows = await client.fetch<SanityDocument[]>(ALL_ROWS_QUERY);
  return rows.map((row) => ({ slug: row.slug }));
}

export default async function PortfolioRowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [row, navRows] = await Promise.all([
    client.fetch<SanityDocument>(ROW_QUERY, { slug }, options),
    client.fetch<SanityDocument[]>(ROW_NAV_QUERY, {}, options),
  ]);

  const currentIndex = navRows.findIndex((r) => r.slug === slug);
  const hasSiblings = currentIndex !== -1 && navRows.length > 1;
  const prevRow = hasSiblings
    ? navRows[(currentIndex - 1 + navRows.length) % navRows.length]
    : null;
  const nextRow = hasSiblings
    ? navRows[(currentIndex + 1) % navRows.length]
    : null;

  if (!row) {
    return (
      <main
        id="main-content"
        className="container mx-auto min-h-screen max-w-5xl p-8"
      >
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold mt-8">Portfolio row not found</h1>
      </main>
    );
  }

  const portfolioWorks = (row.portfolioItems ?? []).map(
    (item: SanityDocument) => ({
      name: item.title,
      description: item.shortDescription ?? undefined,
      image: item.image
        ? (urlFor(item.image as SanityImageSource)?.url() ?? undefined)
        : undefined,
      year: item.year ?? undefined,
      technologies: item.technologies ?? undefined,
    }),
  );

  return (
    <main className="portfolioRowPage" id="main-content">
      <StructuredData
        nodes={[
          personNode(),
          webSiteNode(),
          portfolioRowCollectionNode({
            path: `/portfolio-row/${slug}`,
            name: row.name,
            description: row.blurb ?? undefined,
            items: portfolioWorks,
          }),
          breadcrumbNode([
            { name: "Home", url: "/" },
            { name: row.name, url: `/portfolio-row/${slug}` },
          ]),
        ]}
      />
      <div className="portfolioRowPage__hero">
        <div className="portfolioRowPage__hero-inner container mx-auto px-8">
          <div className="portfolioRowPage__hero-content">
            <Link href="/" className="back-link">
              ← Back to home
            </Link>
            <h1 className="portfolioRowPage__title">{row.name}</h1>
            {Array.isArray(row.description) && row.description.length > 0 && (
              <div className="portfolioRowPage__description">
                <PortableText
                  value={row.description}
                  components={portableTextComponents}
                />
              </div>
            )}
            {row.blurb && (
              <p className="portfolioRowPage__blurb">{row.blurb}</p>
            )}
          </div>

          {prevRow && nextRow && (
            <nav
              className="portfolioRowPage__pager"
              aria-label="Portfolio row navigation"
            >
              <Link
                href={`/portfolio-row/${prevRow.slug}`}
                className="portfolioRowPage__pager-link portfolioRowPage__pager-link--prev"
                rel="prev"
              >
                <span className="portfolioRowPage__pager-direction">
                  ← Previous
                </span>
                <span className="portfolioRowPage__pager-name">
                  {prevRow.name}
                </span>
              </Link>
              <Link
                href={`/portfolio-row/${nextRow.slug}`}
                className="portfolioRowPage__pager-link portfolioRowPage__pager-link--next"
                rel="next"
              >
                <span className="portfolioRowPage__pager-direction">
                  Next →
                </span>
                <span className="portfolioRowPage__pager-name">
                  {nextRow.name}
                </span>
              </Link>
            </nav>
          )}
        </div>
      </div>

      <section className="portfolioRowPage__items">
        <div className="container mx-auto px-8 py-12">
          <div className="portfolioRowPage__grid">
            {(row.portfolioItems ?? []).length === 0 && (
              <p className="portfolioRowPage__empty">
                No items in this row yet.
              </p>
            )}
            {(row.portfolioItems ?? []).map((item: SanityDocument) => {
              const imageUrl = item.image
                ? (urlFor(item.image as SanityImageSource)
                    ?.width(640)
                    .height(400)
                    .fit("crop")
                    .crop("top")
                    .url() ?? "/globe.svg")
                : "/globe.svg";

              const rawGallery: GalleryImage[] = (item.gallery ?? [])
                .map((img: SanityDocument) => ({
                  url:
                    urlFor(img as SanityImageSource)
                      ?.width(1600)
                      .fit("max")
                      .url() ?? "",
                  thumbUrl:
                    urlFor(img as SanityImageSource)
                      ?.width(240)
                      .height(150)
                      .fit("crop")
                      .crop("top")
                      .url() ?? "",
                  alt: img.alt ?? item.title,
                }))
                .filter((img: GalleryImage) => img.url !== "");

              const featuredAsGalleryImage: GalleryImage | null = item.image
                ? {
                    url:
                      urlFor(item.image as SanityImageSource)
                        ?.width(1600)
                        .fit("max")
                        .url() ?? "",
                    thumbUrl:
                      urlFor(item.image as SanityImageSource)
                        ?.width(240)
                        .height(150)
                        .fit("crop")
                        .crop("top")
                        .url() ?? "",
                    alt: item.image.alt ?? item.title,
                  }
                : null;

              const galleryImages: GalleryImage[] =
                rawGallery.length > 0
                  ? [
                      ...(featuredAsGalleryImage?.url
                        ? [featuredAsGalleryImage]
                        : []),
                      ...rawGallery,
                    ]
                  : [];

              return (
                <article key={item._id} className="portfolioRowPage__item">
                  <div className="portfolioRowPage__item-image-wrapper">
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      fill
                      className="portfolioRowPage__item-image"
                    />
                  </div>
                  <div className="portfolioRowPage__item-content">
                    <div className="portfolioRowPage__item-header">
                      <h2 className="portfolioRowPage__item-title">
                        {item.title}
                      </h2>
                      {item.year && (
                        <time
                          className="portfolioRowPage__item-year"
                          dateTime={String(item.year)}
                        >
                          {item.year}
                        </time>
                      )}
                    </div>
                    {Array.isArray(item.body) && item.body.length > 0 && (
                      <div className="portfolioRowPage__item-body">
                        <PortableText
                          value={item.body}
                          components={portableTextComponents}
                        />
                      </div>
                    )}
                    <GalleryModal images={galleryImages} title={item.title} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
