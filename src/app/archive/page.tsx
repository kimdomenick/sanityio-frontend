import Link from "next/link";
import { type SanityDocument, PortableText } from "next-sanity";

import { client } from "@/sanity/client";

const ARCHIVE_QUERY = `*[_type == "landingPage" && slug.current == "archive"][0]`;
const ALL_POSTS_QUERY = `*[
  _type == "article"
  && defined(slug.current)
]|order(date desc){_id, name, slug, summary, date, archive}`;

const options = { next: { revalidate: 30 } };

export default async function ArchivePage() {
  const [archivePage, posts] = await Promise.all([
    client.fetch<SanityDocument>(ARCHIVE_QUERY, {}, options),
    client.fetch<SanityDocument[]>(ALL_POSTS_QUERY, {}, options)
  ]);

  if (!archivePage) {
    return (
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <Link href="/" className="hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold">Archive page not found</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <Link href="/" className="hover:underline mb-8 inline-block">
        ← Back to home
      </Link>
      <h1 className="text-4xl font-bold mb-8">{archivePage.name}</h1>
      {archivePage.body && (
        <div className="prose mb-12">
          {(() => {
            try {
              // Ensure body is properly formatted for PortableText
              const bodyContent = Array.isArray(archivePage.body) ? archivePage.body : [];
              if (bodyContent.length === 0) return null;

              return <PortableText value={bodyContent} />;
            } catch (error) {
              console.error('PortableText error on archive page:', error);
              // Fallback: don't render the body content if there's an error
              return null;
            }
          })()}
        </div>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">All Articles</h2>
        <ul className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <li className="hover:underline" key={post._id}>
              <Link href={`/article/${post.slug.current}`}>
                <h3 className="text-xl font-semibold">{post.name}</h3>
                <p className="text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
                {post.summary && (
                  <div className="text-sm mt-1">
                    {Array.isArray(post.summary) ? (
                      <PortableText value={post.summary} />
                    ) : (
                      <p>{post.summary}</p>
                    )}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}