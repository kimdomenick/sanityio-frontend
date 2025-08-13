import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#00ab78] h-60 lg:h-60 mt-auto" role="contentinfo">
      <div className="container mx-auto px-8 py-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
          {/* Column 1 - Empty for now */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-4">Column 1</h3>
            <div className="text-white/80">
              {/* Content can be added here later */}
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <nav role="navigation" aria-label="Footer navigation">
              <ul className="space-y-2">
                {navigationItems.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 - Empty for now */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-4">Column 3</h3>
            <div className="text-white/80">
              {/* Content can be added here later */}
            </div>
          </div>

          {/* Column 4 - Empty for now */}
          <div className="flex flex-col">
            <h3 className="text-white font-semibold mb-4">Column 4</h3>
            <div className="text-white/80">
              {/* Content can be added here later */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}