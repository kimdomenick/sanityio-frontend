import Link from "next/link";
import Image from "next/image";
import "@/app/styles/Footer.css";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
];

export default function Footer() {
  return (
    <footer className="site-footer w-full" role="contentinfo">
      <div className="site-footer__bg--1">
        <div className="site-footer__bg--2">
          <div className="container mx-auto px-8 py-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
              {/* Column 1 - Empty for now */}
              <div className="flex flex-col">
                <p className="not-nav">
                  <strong>A lot of people would put navigation here</strong>
                </p>
                <Image
                  src="/tv.svg"
                  alt=""
                  width={300}
                  height={300}
                  className="site-footer__svg"
                />
              </div>

              {/* Column 2 - Empty for now  */}
              <div className="flex flex-col"></div>

              {/* Column 3 - Empty for now */}
              <div className="flex flex-col"></div>

              {/* Column 4 - Empty for now */}
              <div className="flex flex-col"></div>
            </div>
          </div>
          <div className="site-footer__copyright">
            <div className="container mx-auto">
              &copy; Copyright 2026. All rights reserved. As if you're gonna
              steal this shit.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
