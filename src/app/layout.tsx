import type { Metadata } from "next";
import { Geist, Geist_Mono, Tenor_Sans, Pacifico, Abril_Fatface, Oooh_Baby } from "next/font/google";
import "./styles/globals.css";
import "./styles/typography.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: "Rose Colored Code",
  description:
    "A technical and creative portfolio by web developer and technical writer, Kim Rosenberry",
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
        <Header />
        <div className="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
