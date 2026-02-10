import Link from "next/link";
import { type SanityDocument, PortableText } from "next-sanity";
import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";
import PortfolioCardExpanded from "@/components/PortfolioCardExpanded";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";

const HOME_QUERY = `*[_type == "landingPage" && slug.current == "home"][0]`;
const POSTS_QUERY = `*[
  _type == "article"
  && archive == false
  && defined(slug.current)
]|order(date desc)[0...12]{_id, name, slug, summary, date, archive}`;

const options = { next: { revalidate: 30 } };

// Sample portfolio data - replace with your actual Sanity data later
const portfolioProjects = [
  {
    title: "E-Commerce Platform",
    year: "2024",
    image: "/globe.svg",
    description: "Built a full-stack e-commerce platform with real-time inventory management",
    details: "Led the development of a comprehensive e-commerce solution serving 100k+ monthly users. Implemented real-time inventory tracking, payment processing, and order management systems.",
    technologies: ["Next.js", "React", "Node.js", "PostgreSQL", "Stripe"],
    link: "#"
  },
  {
    title: "Healthcare Portal",
    year: "2022",
    image: "/globe.svg",
    description: "HIPAA-compliant patient management system for healthcare providers",
    details: "Developed a secure healthcare portal enabling patients to access medical records, schedule appointments, and communicate with providers while maintaining HIPAA compliance.",
    technologies: ["React", "TypeScript", "AWS", "FHIR", "OAuth"],
    link: "#"
  },
  {
    title: "Analytics Dashboard",
    year: "2021",
    image: "/globe.svg",
    description: "Real-time data visualization platform for business intelligence",
    details: "Created an interactive dashboard processing millions of data points daily, providing actionable insights through custom visualizations and automated reporting.",
    technologies: ["Vue.js", "D3.js", "Python", "Redis", "MongoDB"],
    link: "#"
  },
  {
    title: "Mobile App Suite",
    year: "2019",
    image: "/globe.svg",
    description: "Cross-platform mobile applications for iOS and Android",
    details: "Developed and maintained mobile applications used by over 500k users. Implemented offline-first architecture and real-time synchronization.",
    technologies: ["React Native", "Firebase", "GraphQL", "Redux"],
    link: "#"
  },
  {
    title: "Content Management System",
    year: "2017",
    image: "/globe.svg",
    description: "Custom CMS for enterprise content workflows",
    details: "Built a headless CMS supporting multi-language content, version control, and collaborative editing for a global publishing company.",
    technologies: ["Node.js", "Express", "MongoDB", "React", "Elasticsearch"],
    link: "#"
  },
  {
    title: "Financial Trading Platform",
    year: "2015",
    image: "/globe.svg",
    description: "High-frequency trading system with microsecond latency requirements",
    details: "Architected a low-latency trading platform processing thousands of transactions per second with real-time market data integration.",
    technologies: ["C++", "Python", "PostgreSQL", "WebSocket", "Redis"],
    link: "#"
  },
  {
    title: "Social Media Platform",
    year: "2013",
    image: "/globe.svg",
    description: "Niche social networking site with video streaming capabilities",
    details: "Built a social platform featuring user-generated content, live streaming, and community moderation tools serving 200k+ active users.",
    technologies: ["Ruby on Rails", "PostgreSQL", "Redis", "AWS S3", "FFmpeg"],
    link: "#"
  },
  {
    title: "Booking System",
    year: "2011",
    image: "/globe.svg",
    description: "Hotel and restaurant reservation management system",
    details: "Developed a comprehensive booking platform with calendar management, payment processing, and automated confirmation systems.",
    technologies: ["PHP", "MySQL", "jQuery", "PayPal API"],
    link: "#"
  },
  {
    title: "Educational Platform",
    year: "2009",
    image: "/globe.svg",
    description: "Online learning management system for K-12 education",
    details: "Created an LMS enabling teachers to create courses, track student progress, and facilitate online learning with interactive content.",
    technologies: ["ASP.NET", "SQL Server", "JavaScript", "Flash"],
    link: "#"
  },
  {
    title: "CRM System",
    year: "2006",
    image: "/globe.svg",
    description: "Customer relationship management tool for sales teams",
    details: "Built a CRM system tracking customer interactions, sales pipeline, and automated follow-up workflows for small to medium businesses.",
    technologies: ["Java", "Spring", "MySQL", "JSP"],
    link: "#"
  },
  {
    title: "Corporate Website",
    year: "2003",
    image: "/globe.svg",
    description: "Enterprise website with content management capabilities",
    details: "Designed and developed corporate websites with custom CMS, allowing non-technical staff to update content and manage site structure.",
    technologies: ["PHP", "MySQL", "JavaScript", "CSS"],
    link: "#"
  },
  {
    title: "Database Application",
    year: "1998",
    image: "/globe.svg",
    description: "Desktop application for inventory management",
    details: "Created a Windows desktop application for tracking inventory, generating reports, and managing supplier relationships for retail businesses.",
    technologies: ["Visual Basic", "Access", "SQL"],
    link: "#"
  }
];

export default async function IndexPage() {
  const [homePage, posts] = await Promise.all([
    client.fetch<SanityDocument>(HOME_QUERY, {}, options),
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
  ]);

  return (
    <main className="home">
      {homePage && (
        <section id="overview" className="home__overview">
          <div className="container mx-auto max-w-3xl px-8 py-12">
            {Array.isArray(homePage.body) && homePage.body.length > 0 && (
              <div>
                <PortableText
                  value={homePage.body}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>
        </section>
      )}

      <section id="history" className="home__history">
        <HorizontalScrollSection title="27 Years of Innovation">
          {portfolioProjects.map((project, index) => (
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
