import { Carousel } from "@/src/features/home/components/Carousel";
import Link from "next/link";

export default function Home() {
  const carouselImages = [
    { src: "/images/home/carousel/dtf2.webp", alt: "DTF" },
    { src: "/images/home/carousel/dtf3.webp", alt: "DTF" },
    { src: "/images/home/carousel/paint1.webp", alt: "Paint" },
    { src: "/images/home/carousel/paint2.webp", alt: "Paint" },
    { src: "/images/home/carousel/pottery1.webp", alt: "Pottery" },
    { src: "/images/home/carousel/pottery2.webp", alt: "Pottery" },
    { src: "/images/home/carousel/pottery3.webp", alt: "Pottery" },
    { src: "/images/home/carousel/teapot1.webp", alt: "Teapot" },
    { src: "/images/home/carousel/teapot2.webp", alt: "Teapot" },
    { src: "/images/home/carousel/wood1.webp", alt: "Wood" },
    { src: "/images/home/carousel/wood2.webp", alt: "Wood" }
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 w-full min-h-[calc(100vh-100px)]">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
        {/* Left side: Carousel */}
        <section className="w-full lg:w-1/2 relative animate-fade-in [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)]">
          <Carousel images={carouselImages} autoScrollInterval={5} />
        </section>

        {/* Right side: Title, Description, Button */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left animate-fade-in">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-7xl font-family-papernotes text-foreground drop-shadow-sm leading-none">
            Make It With Love
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-xl font-sans">
            The ultimate creative playground for young artists! We believe that the best things in life are handmade. Our platform provides a curated library of high-quality, kid-friendly video tutorials that turn screen time into &quot;hands-on&quot; time.
          </p>
          <Link href="/courses">
            <button className="mt-4 px-10 py-4 bg-[var(--color-pink)] hover:bg-[var(--color-red)] text-white font-bold text-3xl rounded-full hover:scale-105 transition-all shadow-xl font-family-papernotes tracking-widest leading-none flex items-center justify-center">
              lets learn!!
            </button>
          </Link>
        </section>
      </div>
    </main>
  );
}
