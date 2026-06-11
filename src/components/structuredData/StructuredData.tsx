import { buildGraph, type JsonLdNode } from "./builders";

type GraphInput = JsonLdNode | JsonLdNode[] | null | undefined | false;

interface StructuredDataProps {
  /** A pre-built graph object (from `buildGraph`)… */
  graph?: object;
  /** …or the raw nodes to assemble into one. */
  nodes?: GraphInput[];
}

/**
 * Renders a JSON-LD <script> tag. Server component — no client JS shipped.
 * Pass either a `graph` (from `buildGraph`) or a list of `nodes`.
 *
 *   <StructuredData nodes={[personNode(), webSiteNode(), articleNode({...})]} />
 */
export default function StructuredData({ graph, nodes }: StructuredDataProps) {
  const data = graph ?? buildGraph(...(nodes ?? []));

  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes nothing dangerous here (Sanity-sourced strings),
      // but guard the one sequence that can break out of a <script> element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
