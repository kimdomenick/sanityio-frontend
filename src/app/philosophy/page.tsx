import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/client";
import type { SanityDocument } from "@/sanity/types";
import { portableTextComponents } from "@/components/PortableTextComponents";
import {
  StructuredData,
  personNode,
  webSiteNode,
  profilePageNode,
  breadcrumbNode,
} from "@/components/structuredData";

const ABOUT_QUERY = `*[_type == "landingPage" && slug.current == "philosophy"][0]`;

const options = { next: { revalidate: 30 } };

export default async function AboutPage() {
  const aboutPage = await client.fetch<SanityDocument>(
    ABOUT_QUERY,
    {},
    options,
  );

  if (!aboutPage) {
    return (
      <main
        className="container mx-auto min-h-screen max-w-3xl p-8"
        id="main-content"
      >
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold">About page not found</h1>
      </main>
    );
  }

  return (
    <main className="about" id="main-content">
      <StructuredData
        nodes={[
          personNode(),
          webSiteNode(),
          profilePageNode({
            path: "/philosophy",
            name: aboutPage.name,
          }),
          breadcrumbNode([
            { name: "Home", url: "/" },
            { name: aboutPage.name, url: "/philosophy" },
          ]),
        ]}
      />
      <div className="container mx-auto min-h-screen max-w-3xl p-8">
        <Link href="/" className="back-link">
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
    </main>
  );
}
