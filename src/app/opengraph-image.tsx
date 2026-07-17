import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share card (LinkedIn, X, Slack, etc.). Renders the logo on a
// brand-colored background so transparent-PNG areas don't show as black,
// and enforces the standard 1200x630 Open Graph size.
export const alt =
  "Rose Colored Code — a technical and creative portfolio by Kim Rosenberry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/FullLogo_Transparent.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf5dc 0%, #f1ceae 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={840}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
