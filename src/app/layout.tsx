import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NavBar } from "@/src/components/NavBar";
import { BackgroundDecoration } from "@/src/components/BackgroundDecoration";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
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
      className={`${montserrat.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative w-full overflow-x-hidden">
        <BackgroundDecoration />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
