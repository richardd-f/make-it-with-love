import type { Metadata } from "next";
import { NavBar } from "@/src/components/NavBar";
import { BackgroundDecoration } from "@/src/components/BackgroundDecoration";
import "./globals.css";
import localFont from 'next/font/local';

const montserrat = localFont({
  src: [
    { path: '../../public/typography/Montserrat-Regular.ttf', weight: '400' },
    { path: '../../public/typography/Montserrat-Bold.ttf', weight: '700' },
  ],
  variable: '--font-montserrat', // This matches your CSS variable
});

const papernotes = localFont({
  src: '../../public/typography/Papernotes.ttf',
  variable: '--font-papernotes',
});

export const metadata: Metadata = {
  title: "Make It With Love",
  description: "A place to share your love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${papernotes.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative w-full overflow-x-hidden">
        <BackgroundDecoration />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
