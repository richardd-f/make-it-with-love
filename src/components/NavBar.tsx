import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/src/auth";

export async function NavBar() {
  const session = await auth();

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
        {session ? (
          <div className="relative group">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f6e5c4] text-[#e4552c] cursor-pointer shadow-sm hover:ring-2 hover:ring-[#f79d1c] transition-all"
              title="Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <div className="absolute right-0 top-full mt-1 w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#f6e5c4] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 flex flex-col gap-3">
              <div className="flex flex-col border-b border-gray-100 pb-2">
                <span className="font-bold text-sm text-gray-800 truncate" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                  {session.user?.name}
                </span>
                <span className="text-xs text-gray-500 truncate" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                  {session.user?.email}
                </span>
              </div>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="w-full text-left text-sm font-bold text-[#e4552c] hover:text-[#ea7c9d] transition-colors py-1 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </form>
            </div>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="px-6 py-2 bg-[#ea7c9d] hover:bg-[#e4552c] text-white font-bold rounded-full shadow-md transition-colors font-family-papernotes tracking-widest text-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
