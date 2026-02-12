import type { Metadata } from "next";
import { Geist, Geist_Mono, Tenor_Sans } from "next/font/google";
import localFont from "next/font/local";
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

const thicccboi = localFont({
  src: [
    {
      path: "../fonts/THICCCBOI-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/THICCCBOI-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/THICCCBOI-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-thicccboi",
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
        className={`${geistSans.variable} ${geistMono.variable} ${tenorSans.variable} ${thicccboi.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <div className="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
