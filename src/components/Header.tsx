import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Slogan/site description placeholder */}
            <div className="text-gray-600 hidden md:block radial">
              <h1 className="rosey">Rose Colored Code</h1>
              <span className="text copy rosey" aria-hidden="true">
                Rose Colored Code
              </span>
            </div>
          </div>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
