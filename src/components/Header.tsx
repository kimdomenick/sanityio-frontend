import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header w-full border-b border-gray-200">
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* Logo and Site name */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Image
                src="/FullLogo_Transparent.png"
                alt="Rose-colored Code Logo"
                width={150}
                height={150}
                priority
              />
            </div>
            <div>
              <h1 className="site-title text-4xl font-bold">
                Rose-Colored Code
              </h1>
              {/* Slogan */}
              <p className="site-slogan text-md">
                Optimism, backed by 27 years of experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
