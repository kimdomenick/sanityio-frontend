import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import "@/app/styles/pages/portfolioRow.css";

type SanityDocument = Record<string, any>;

const ROW_QUERY = `*[
  _type == "portfolioRow"
  && _id == $id
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
    siteStatus,
    "technologies": portfolioCategory[]->title
  }
}`;

const ALL_ROWS_QUERY = `*[_type == "portfolioRow" && !(_id in path("drafts.**"))]{ _id }`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export async function generateStaticParams() {
  const rows = await client.fetch<SanityDocument[]>(ALL_ROWS_QUERY);
  return rows.map((row) => ({ id: row._id }));
}

export default async function PortfolioRowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await client.fetch<SanityDocument>(ROW_QUERY, { id }, options);

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
        <div className="container mx-auto px-8">
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
                    {item.siteStatus && (
                      <span className={`portfolioRowPage__item-status portfolioRowPage__item-status--${item.siteStatus}`}>
                        {item.siteStatus}
                      </span>
                    )}
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
