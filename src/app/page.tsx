import Link from "next/link";
import { type SanityDocument, PortableText } from "next-sanity";

import { client } from "@/sanity/client";

const HOME_QUERY = `*[_type == "landingPage" && slug.current == "home"][0]`;
const POSTS_QUERY = `*[
  _type == "article"
  && archive == false
  && defined(slug.current)
]|order(date desc)[0...12]{_id, name, slug, summary, date, archive}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const [homePage, posts] = await Promise.all([
    client.fetch<SanityDocument>(HOME_QUERY, {}, options),
    client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options),
  ]);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      {homePage && (
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-8">{homePage.name}</h1>
          {Array.isArray(homePage.body) && homePage.body.length > 0 && (
            <div className="prose mb-8">
              <PortableText value={homePage.body} />
            </div>
          )}
        </div>
      )}

      <section>
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
      </section>
    </main>
  );
}
