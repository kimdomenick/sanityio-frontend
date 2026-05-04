import Link from "next/link";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import PortfolioCardExpanded from "@/components/PortfolioCardExpanded";

// Type for Sanity documents
type SanityDocument = Record<string, any>;

const ABOUT_QUERY = `*[_type == "landingPage" && slug.current == "about"][0]`;

const PORTFOLIO_QUERY = `*[
  _type == "portfolioArchive"
  && published == true
  && portfolioType->title == "Tech/Development"
  && defined(slug.current)
] | order(year desc) {
  _id,
  title,
  slug,
  year,
  shortDescription,
  body,
  image,
  "technologies": portfolioCategory[]->title
}`;

// Image URL builder
const { projectId, dataset } = client.config();
const urlFor = (source: any) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function AboutPage() {
  const [aboutPage, portfolioItems] = await Promise.all([
    client.fetch<SanityDocument>(ABOUT_QUERY, {}, options),
    client.fetch<SanityDocument[]>(PORTFOLIO_QUERY, {}, options),
  ]);

  // Map portfolio data to component format
  const portfolioProjects = portfolioItems.map((item: any) => ({
    title: item.title,
    year: item.year?.toString() || "",
    image: item.image
      ? urlFor(item.image)?.width(400).height(300).url() || "/globe.svg"
      : "/globe.svg",
    description: item.shortDescription || "",
    details: item.body ? "" : item.shortDescription || "", // Will use body in modal
    technologies: item.technologies || [],
    link: item.slug?.current ? `/portfolio/${item.slug.current}` : "#",
    body: item.body || null,
  }));

  if (!aboutPage) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8" id="main-content">
        <Link href="/" className="hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold">About page not found</h1>
      </main>
    );
  }

  return (
    <main className="about" id="main-content">
      <div className="container mx-auto min-h-screen max-w-3xl p-8">
        <Link href="/" className="hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-8">{aboutPage.name}</h1>
        {Array.isArray(aboutPage.body) && aboutPage.body.length > 0 && (
          <div>
            <PortableText
              value={aboutPage.body}
              components={portableTextComponents}
            />
          </div>
        )}
      </div>
      <section id="history" className="about__history">
        <HorizontalScrollSection title="25+ Years of Innovation">
          {portfolioProjects.map((project: any, index: number) => (
            <PortfolioCardExpanded
              key={index}
              title={project.title}
              year={project.year}
              image={project.image}
              description={project.description}
              details={project.details}
              technologies={project.technologies}
              link={project.link}
            />
          ))}
        </HorizontalScrollSection>
      </section>
    </main>
  );
}
