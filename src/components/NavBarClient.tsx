'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
  label: string;
  mode: 'single' | 'multiple';
  href?: string;
  adminOnly?: boolean;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'My Courses', mode: 'single', href: '/myCourse' },
  { label: 'Look for courses', mode: 'single', href: '/courses' },
  {
    label: 'Admin',
    mode: 'multiple',
    adminOnly: true,
    children: [
      { label: 'Courses', href: '/admin/courses' },
      { label: 'DIY Kits', href: '/admin/diyKits' },
    ],
  },
];

type NavBarClientProps = {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  } | null;
  logoutAction: () => Promise<void>;
};

export function NavBarClient({ session, logoutAction }: NavBarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  // Filter items based on role
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="w-full flex items-center justify-between px-14 py-4 bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-foreground/5 shadow-sm">
      <Link href="/" className="transition-transform hover:scale-105 z-50">
        <Image
          src="/images/logo/logo_main.webp"
          alt="Make It With Love Logo"
          width={150}
          height={60}
          priority
          className="object-contain"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {visibleNavItems.map((item, index) => (
          <div key={index} className="relative group">
            {item.mode === 'single' ? (
              <Link
                href={item.href!}
                className="text-gray-700 font-bold hover:text-[#32a569] transition-colors"
                style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
              >
                {item.label}
              </Link>
            ) : (
              <div className="relative group/dropdown cursor-pointer">
                <span
                  className="text-gray-700 font-bold hover:text-[#32a569] transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                >
                  {item.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 flex flex-col overflow-hidden">
                  {item.children?.map((child, cIndex) => (
                    <Link
                      key={cIndex}
                      href={child.href}
                      className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-[#32a569]/10 hover:text-[#32a569] transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Desktop Profile / Login */}
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

            <div className="absolute right-0 top-full mt-1 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#f6e5c4] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 flex flex-col gap-3">
              <div className="flex flex-col border-b border-gray-100 pb-2">
                <span className="font-bold text-sm text-gray-800 truncate" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                  {session.user?.name}
                </span>
                <span className="text-xs text-gray-500 truncate" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                  {session.user?.email}
                </span>
              </div>
              <form action={logoutAction}>
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

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-700 hover:text-[#32a569] transition-colors z-50 focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isMobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-xl z-40 md:hidden flex flex-col pt-24 px-6 pb-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6 w-full">
            {visibleNavItems.map((item, index) => (
              <div key={index} className="flex flex-col border-b border-gray-100 pb-4">
                {item.mode === 'single' ? (
                  <Link
                    href={item.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-bold text-gray-800 hover:text-[#32a569] transition-colors font-family-papernotes tracking-wide"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <span className="text-2xl font-bold text-[var(--color-orange)] font-family-papernotes tracking-wide">
                      {item.label}
                    </span>
                    <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#f6e5c4] ml-2">
                      {item.children?.map((child, cIndex) => (
                        <Link
                          key={cIndex}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-lg font-bold text-gray-600 hover:text-[#32a569] transition-colors"
                          style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Profile / Login */}
            <div className="mt-4 pt-4 border-t-2 border-gray-100">
              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f6e5c4] text-[#e4552c] shadow-sm">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg text-gray-800" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                        {session.user?.name}
                      </span>
                      <span className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}>
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                  <form action={logoutAction} className="mt-2">
                    <button type="submit" className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-red-500 font-bold text-lg rounded-2xl transition-colors flex items-center justify-center gap-2 font-family-papernotes tracking-wide">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-4 text-center bg-[#ea7c9d] text-white font-bold rounded-2xl shadow-md transition-colors font-family-papernotes tracking-widest text-2xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
