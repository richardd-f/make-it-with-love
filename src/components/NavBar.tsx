import Image from "next/image";
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-foreground/5 shadow-sm">
      <Link href="/" className="transition-transform hover:scale-105">
        <Image
          src="/images/logo/logo_main.webp"
          alt="Make It With Love Logo"
          width={150}
          height={60}
          priority
          className="object-contain"
        />
      </Link>

      {/* Add more nav links here in the future if needed */}
      <div className="flex items-center gap-6">
        {/* Placeholder for future links */}
      </div>
    </nav>
  );
}
