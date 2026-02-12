import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
];

export default function Footer() {
  return (
    <footer className="site-footer w-full" role="contentinfo">
      <div className="container mx-auto px-8 py-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
          {/* Column 1 - Empty for now */}
          <div className="flex flex-col"></div>

          {/* Column 2 - Empty for now  */}
          <div className="flex flex-col"></div>

          {/* Column 3 - Empty for now */}
          <div className="flex flex-col"></div>

          {/* Column 4 - Empty for now */}
          <div className="flex flex-col"></div>
        </div>
      </div>
    </footer>
  );
}
