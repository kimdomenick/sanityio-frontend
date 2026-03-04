import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import PortfolioCardExpanded from "@/components/PortfolioCardExpanded";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import "@/app/styles/pages/home.css";

// Type for Sanity documents
type SanityDocument = Record<string, any>;

const HOME_QUERY = `*[_type == "landingPage" && slug.current == "home"][0]`;
const POSTS_QUERY = `*[
  _type == "article"
  && archive == false
  && defined(slug.current)
]|order(date desc)[0...12]{_id, name, slug, summary, date, archive}`;

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

const options = { next: { revalidate: 30 } };

// Image URL builder
const { projectId, dataset } = client.config();
const urlFor = (source: any) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// Portfolio data is now fetched from Sanity in the component

export default async function IndexPage() {
  const [homePage, posts, portfolioItems] = await Promise.all([
    client.fetch<SanityDocument>(HOME_QUERY, {}, options),
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
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

  // Group projects by year (preserves desc order from query)
  const projectsByYear = portfolioProjects.reduce(
    (acc: Record<string, typeof portfolioProjects>, project: any) => {
      const year = project.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(project);
      return acc;
    },
    {},
  );
  const yearGroups = Object.entries(projectsByYear);

  return (
    <main className="home">
      <section id="hello" className="home__hello">
        <p>
          Hi, I’m Kimberly Rosenberry. <br />I build thoughtful, resilient
          frontend systems.
        </p>
      </section>
      <section id="overview" className="home__overview">
        <div className="container mx-auto px-8 py-12">
          <div className="overview-grid">
            {/* Column 1: Experience */}
            <div className="overview-column">
              <h2 className="overview-column__title">Experience</h2>
              <p className="overview-column__content">
                I stopped counting at 25 years. Let's just say{" "}
                <strong>I've outlived few frameworks</strong>. From early,
                static HTML sites to complex, decoupled apps and APIs, I've
                worked across the full stack, but my passion lies in building
                exceptional frontend experiences.
              </p>
              <p>
                <Link href="/about">My philosophy</Link>
              </p>
            </div>

            {/* Icon/Graphic 1 */}
            <div className="overview-icon">
              <Image
                src="/star.svg"
                alt=""
                width={70}
                height={70}
                className="overview-icon__svg"
              />
            </div>

            {/* Column 2: Current Situation */}
            <div className="overview-column">
              <h2 className="overview-column__title">Current Situation</h2>
              <div className="overview-column__content">
                {homePage &&
                Array.isArray(homePage.body) &&
                homePage.body.length > 0 ? (
                  <PortableText
                    value={homePage.body}
                    components={portableTextComponents}
                  />
                ) : null}
              </div>
            </div>

            {/* Icon/Graphic 2 */}
            <div className="overview-icon">
              <Image
                src="/star.svg"
                alt=""
                width={70}
                height={70}
                className="overview-icon__svg"
              />
            </div>

            {/* Column 3: History */}
            <div className="overview-column">
              <h2 className="overview-column__title">History</h2>
              <p className="overview-column__content">There's a lot of it.</p>
              <p className="overview-column__content">
                Each project below represents a milestone in my journey,
                showcasing the technologies and challenges of their time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="flip-flop" className="home__flip-flop">
        {yearGroups.map(([year, projects], index) => (
          <section
            key={year}
            className={`home__flip-flop__year home__flip-flop__year--${year} ${index % 2 === 0 ? "odd" : "even"}`}
          >
            <div className="container mx-auto">
              <div
                className={`home__flip-flop__year home__flip-flop__year--${year} title`}
              >
                <h3>{year}</h3>
              </div>
              <div
                className={`home__flip-flop__year home__flip-flop__year--${year} content`}
              >
                <HorizontalScrollSection showProgress={false}>
                  {(projects as any[]).map(
                    (project: any, cardIndex: number) => (
                      <PortfolioCardExpanded
                        key={cardIndex}
                        title={project.title}
                        year={project.year}
                        image={project.image}
                        description={project.description}
                        details={project.details}
                        technologies={project.technologies}
                        link={project.link}
                      />
                    ),
                  )}
                </HorizontalScrollSection>
              </div>
            </div>
          </section>
        ))}
      </section>

      {/* <section id="articles" className="home__articles max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li className="hover:underline" key={post._id}>
              <Link href={`/article/${post.slug.current}`}>
                <h3 className="text-xl font-semibold">{post.name}</h3>
                <p>{new Date(post.date).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section> */}
    </main>
  );
}
