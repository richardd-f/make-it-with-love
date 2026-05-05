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

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link 
          href="/myCourse" 
          className="text-gray-700 font-bold hover:text-[#32a569] transition-colors"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          My Courses
        </Link>
        <Link 
          href="/courses" 
          className="text-gray-700 font-bold hover:text-[#32a569] transition-colors"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          Look for courses
        </Link>
        <Link 
          href="/account" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f6e5c4] text-[#e4552c] hover:bg-[#f79d1c] hover:text-white transition-colors shadow-sm"
          title="Account"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>
    </nav>
  );
}
