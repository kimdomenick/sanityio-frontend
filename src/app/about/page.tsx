import Link from "next/link";
import { type SanityDocument, PortableText } from "next-sanity";

import { client } from "@/sanity/client";
import { portableTextComponents } from "@/components/PortableTextComponents";

const ABOUT_QUERY = `*[_type == "landingPage" && slug.current == "about"][0]`;

const options = { next: { revalidate: 30 } };

export default async function AboutPage() {
  const aboutPage = await client.fetch<SanityDocument>(ABOUT_QUERY, {}, options);

  if (!aboutPage) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <Link href="/" className="hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold">About page not found</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <Link href="/" className="hover:underline mb-8 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{aboutPage.name}</h1>
      {Array.isArray(aboutPage.body) && aboutPage.body.length > 0 && (
        <div>
          <PortableText value={aboutPage.body} components={portableTextComponents} />
        </div>
      )}
    </main>
  );
}