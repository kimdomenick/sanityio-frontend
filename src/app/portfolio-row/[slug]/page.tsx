import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import GalleryModal, { type GalleryImage } from "@/components/GalleryModal";
import "@/app/styles/pages/portfolioRow.css";

type SanityDocument = Record<string, any>;

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
  const row = await client.fetch<SanityDocument>(ROW_QUERY, { slug }, options);

  if (!row) {
    return (
      <main className="container mx-auto min-h-screen max-w-5xl p-8">
        <Link href="/" className="hover:underline">← Back to home</Link>
        <h1 className="text-4xl font-bold mt-8">Portfolio row not found</h1>
      </main>
    );
  }

  return (
    <main className="portfolioRowPage">
      <div className="portfolioRowPage__hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sign.svg"
          alt=""
          aria-hidden="true"
          className="portfolioRowPage__hero-sign"
        />
        <div className="portfolioRowPage__hero-content container mx-auto px-8">
          <Link href="/" className="portfolioRowPage__back">← Back to home</Link>
          <h1 className="portfolioRowPage__title">{row.name}</h1>
          {Array.isArray(row.description) && row.description.length > 0 && (
            <div className="portfolioRowPage__description">
              <PortableText value={row.description} components={portableTextComponents} />
            </div>
          )}
          {row.blurb && (
            <p className="portfolioRowPage__blurb">{row.blurb}</p>
          )}
        </div>
      </div>

      <section className="portfolioRowPage__items">
        <div className="container mx-auto px-8 py-12">
          <div className="portfolioRowPage__grid">
            {(row.portfolioItems ?? []).length === 0 && (
              <p className="portfolioRowPage__empty">No items in this row yet.</p>
            )}
            {(row.portfolioItems ?? []).map((item: any) => {
              const imageUrl = item.image
                ? (urlFor(item.image as SanityImageSource)?.width(600).height(450).url() ?? "/globe.svg")
                : "/globe.svg";

              const technologies: string[] = item.technologies ?? [];

              const rawGallery: GalleryImage[] = (item.gallery ?? [])
                .map((img: any) => ({
                  url: urlFor(img as SanityImageSource)?.width(1200).height(900).url() ?? "",
                  thumbUrl: urlFor(img as SanityImageSource)?.width(200).height(150).url() ?? "",
                  alt: img.alt ?? item.title,
                }))
                .filter((img: GalleryImage) => img.url !== "");

              const featuredAsGalleryImage: GalleryImage | null = item.image
                ? {
                    url: urlFor(item.image as SanityImageSource)?.width(1200).height(900).url() ?? "",
                    thumbUrl: urlFor(item.image as SanityImageSource)?.width(200).height(150).url() ?? "",
                    alt: item.image.alt ?? item.title,
                  }
                : null;

              const galleryImages: GalleryImage[] = rawGallery.length > 0
                ? [
                    ...(featuredAsGalleryImage?.url ? [featuredAsGalleryImage] : []),
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
                      <h2 className="portfolioRowPage__item-title">{item.title}</h2>
                      {item.year && (
                        <span className="portfolioRowPage__item-year">{item.year}</span>
                      )}
                    </div>
                    {item.shortDescription && (
                      <p className="portfolioRowPage__item-description">{item.shortDescription}</p>
                    )}
                    {technologies.length > 0 && (
                      <div className="portfolioRowPage__item-technologies">
                        {technologies.map((tech, i) => (
                          <span key={i} className="portfolioRowCard__tech-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                    {Array.isArray(item.body) && item.body.length > 0 && (
                      <div className="portfolioRowPage__item-body">
                        <PortableText value={item.body} components={portableTextComponents} />
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
