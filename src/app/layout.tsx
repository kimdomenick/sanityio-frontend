import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Tenor_Sans,
  Pacifico,
  Abril_Fatface,
  Oooh_Baby,
} from "next/font/google";
import "./styles/globals.css";
import "./styles/typography.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tenor-sans",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

const abrilFatface = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril-fatface",
});

const ooohBaby = Oooh_Baby({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-oooh-baby",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rosecoloredcode.com",
  ),
  title: "Rose Colored Code",
  description:
    "A technical and creative portfolio by web developer and technical writer, Kim Rosenberry",
  openGraph: {
    title: "Rose Colored Code",
    description:
      "A technical and creative portfolio by web developer and technical writer, Kim Rosenberry",
    url: "/",
    siteName: "Rose Colored Code",
    type: "website",
    // Static file (not a route) so trailingSlash: true doesn't 308-redirect
    // the image URL — social scrapers don't follow redirects for og:image.
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rose Colored Code — a technical and creative portfolio by Kim Rosenberry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rose Colored Code",
    description:
      "A technical and creative portfolio by web developer and technical writer, Kim Rosenberry",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${tenorSans.variable} ${pacifico.variable} ${abrilFatface.variable} ${ooohBaby.variable} antialiased flex flex-col min-h-screen`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <Header />
          <div className="main-content">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
