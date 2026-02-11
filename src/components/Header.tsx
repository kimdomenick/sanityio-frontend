import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header w-full border-b border-gray-200">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/FullLogo_Transparent.png"
              alt="Rose-colored Code Logo"
              width={80}
              height={80}
              priority
            />
          </div>

          {/* Site name and slogan */}
          <div className="flex flex-col">
            <h1 className="site-title text-3xl font-bold">Rose Colored Code</h1>
            <p className="site-slogan text-sm mt-1">
              Optimism, backed by 27 years of experience.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
