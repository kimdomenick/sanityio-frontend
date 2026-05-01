import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import PortfolioRowCardExpanded from "@/components/PortfolioRowCardExpanded";
import CardStepper from "@/components/CardStepper";
import "@/app/styles/pages/home.css";

// Type for Sanity documents
type SanityDocument = Record<string, any>;

const HOME_QUERY = `*[_type == "landingPage" && slug.current == "home"][0]`;

const PORTFOLIO_ROW_QUERY = `*[_type == "portfolioRow"] | order(sortOrder asc) {
  _id,
  name,
  blurb,
  description,
  sortOrder,
  "portfolioItems": portfolioItems[]->{
    _id,
    title,
    slug,
    year,
    shortDescription,
    body,
    image,
    "technologies": portfolioCategory[]->title
  }
}`;

const options = { next: { revalidate: 30 } };

// Image URL builder
const { projectId, dataset } = client.config();
const urlFor = (source: any) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function IndexPage() {
  const [homePage, portfolioRows] = await Promise.all([
    client.fetch<SanityDocument>(HOME_QUERY, {}, options),
    client.fetch<SanityDocument[]>(PORTFOLIO_ROW_QUERY, {}, options),
  ]);

  return (
    <main className="home">
      <section id="hello" className="home__hello">
        <h1>Kimberly Rosenberry</h1>
        <p className="my-name">
          Frontend Developer • Systems Analyst • Technical Writer • UX
          Collaborator
        </p>
      </section>
      <section id="overview" className="home__overview">
        <div className="container mx-auto px-8 py-12">
          <div className="overview-grid">
            {/* Column: Current Situation */}
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

            {/* Column: Experience */}
            <div className="overview-column">
              <h2 className="overview-column__title">Experience</h2>
              <p className="overview-column__content">
                Building the web long enough to outlive a few frameworks. Dev,
                tech writing, UX/UI design, the occasional DevOps adventure.
                I've been around.
              </p>
              <p>
                <Link href="/about">My philosophy</Link>
              </p>
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

            {/* Column: History */}
            <div className="overview-column">
              <h2 className="overview-column__title">History</h2>
              <p className="overview-column__content">25+ years of it.</p>
              <p className="overview-column__content">Scroll, please.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="flip-flop" className="home__flip-flop">
        <div className="home__flip-flop__title container mx-auto py-12">
          <h2 className="abril">
            Every row is a journey. Every journey is different.
          </h2>
        </div>
        {portfolioRows.map((row: any, index: number) => {
          const rowTechnologies = [
            ...new Set<string>(
              (row.portfolioItems ?? []).flatMap(
                (item: any) => item.technologies ?? [],
              ),
            ),
          ];

          return (
            <section
              key={row._id}
              className={`home__flip-flop__year ${index % 2 === 0 ? "odd" : "even"}`}
            >
              <div className="container mx-auto">
                <div className="home__flip-flop__year__title">
                  <h3>{row.name}</h3>

                  <div className="home__flip-flop__year__title__description">
                    <PortableText
                      value={row.description}
                      components={portableTextComponents}
                    />
                  </div>
                  {row.blurb && (
                    <div className="home__flip-flop__year__title__blurb">
                      <p>{row.blurb}</p>
                    </div>
                  )}
                  {rowTechnologies.length > 0 && (
                    <div className="home__flip-flop__year__title__technologies">
                      {rowTechnologies.map((tech, i) => (
                        <span key={i} className="portfolioRowCard__tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="home__flip-flop__year content">
                  <CardStepper>
                    {(row.portfolioItems ?? []).map(
                      (item: any, cardIndex: number) => (
                        <PortfolioRowCardExpanded
                          key={cardIndex}
                          title={item.title}
                          year={item.year?.toString() ?? ""}
                          image={
                            item.image
                              ? (urlFor(item.image)
                                  ?.width(400)
                                  .height(300)
                                  .url() ?? "/globe.svg")
                              : "/globe.svg"
                          }
                          description={item.shortDescription ?? ""}
                          details={item.shortDescription ?? ""}
                          link={
                            item.slug?.current
                              ? `/portfolio/${item.slug.current}`
                              : "#"
                          }
                        />
                      ),
                    )}
                  </CardStepper>
                </div>
              </div>
            </section>
          );
        })}
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
