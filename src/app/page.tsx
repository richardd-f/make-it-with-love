import { Carousel } from "@/src/features/home/components/Carousel";
import Image from "next/image";

export default function Home() {
  const carouselImages = [
    { src: "/images/assets/coral1_green.webp", alt: "Green Coral" },
    { src: "/images/assets/coral2_pink.webp", alt: "Pink Coral" },
    { src: "/images/assets/coral1_orange.webp", alt: "Orange Coral" },
    { src: "/images/assets/coral2_red.webp", alt: "Red Coral" },
    { src: "/images/assets/circle_yellow.webp", alt: "Yellow Circle" },
    { src: "/images/logo/logo_main.webp", alt: "Make It With Love Logo" },
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24 w-full">
      {/* Decorative Assets */}
      <div className="absolute top-0 right-0 -z-10 opacity-30 select-none pointer-events-none">
        <Image 
          src="/images/assets/circle_orange.webp" 
          alt="Decoration" 
          width={300} 
          height={300} 
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-30 select-none pointer-events-none">
        <Image 
          src="/images/assets/circle_pink.webp" 
          alt="Decoration" 
          width={250} 
          height={250} 
        />
      </div>

      <div className="max-w-6xl w-full flex flex-col gap-12 items-center text-center">
        {/* Title */}
        <section className="flex flex-col gap-4 max-w-3xl items-center animate-fade-in">
          <Image 
            src="/images/logo/logo_main.webp" 
            alt="Make It With Love" 
            width={120} 
            height={120} 
            className="mb-4"
            priority
          />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-family-papernotes text-foreground drop-shadow-sm">
            Make It With Love
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mt-4 max-w-2xl font-sans">
            A beautiful place to share your passion, creativity, and everything crafted with pure joy and love.
          </p>
        </section>

        {/* Carousel */}
        <section className="w-full mt-8">
          <Carousel images={carouselImages} />
        </section>
      </div>
    </main>
  );
}
