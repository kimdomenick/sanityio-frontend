import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import { portableTextComponents } from "@/components/PortableTextComponents";
import {
  StructuredData,
  personNode,
  webSiteNode,
  articleNode,
  breadcrumbNode,
  toISODate,
} from "@/components/structuredData";

// Type for Sanity documents
type SanityDocument = Record<string, any>;

const POST_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  ...,
  "imageDimensions": image.asset->metadata.dimensions
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug: `/article/${slug}` },
    options,
  );

  if (!post) {
    return (
      <main
        id="main-content"
        className="container mx-auto min-h-screen max-w-3xl p-8"
      >
        <Link href="/archive" className="back-link">
          ← Back to articles
        </Link>
        <h1 className="text-4xl font-bold mt-8">Article not found</h1>
      </main>
    );
  }

  const postImageUrl = post.image ? urlFor(post.image)?.url() : null;

  return (
    <main
      id="main-content"
      className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"
    >
      <StructuredData
        nodes={[
          personNode(),
          webSiteNode(),
          articleNode({
            path: `/article/${slug}`,
            headline: post.name,
            image: postImageUrl ?? undefined,
            datePublished: toISODate(post.date),
            dateModified: toISODate(post._updatedAt),
          }),
          breadcrumbNode([
            { name: "Home", url: "/" },
            { name: "Archive", url: "/archive" },
            { name: post.name, url: `/article/${slug}` },
          ]),
        ]}
      />
      <Link href="/archive" className="back-link">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.name}
          width={post.imageDimensions?.width}
          height={post.imageDimensions?.height}
          className="h-auto w-auto max-w-[200px] rounded-xl"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.name}</h1>
      <div>
        <p className="mb-4 text-gray-600">
          Published: {new Date(post.date).toLocaleDateString()}
        </p>
        {Array.isArray(post.body) && (
          <PortableText value={post.body} components={portableTextComponents} />
        )}
      </div>
    </main>
  );
}
