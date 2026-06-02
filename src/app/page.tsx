import Link from "next/link";
import { Carousel } from "@/src/features/home/components/Carousel";
import { getCourses } from "@/src/features/courses/actions/get-courses.action";
import { CourseCard } from "@/src/features/courses/components/course-card";
import { auth } from "@/src/auth";

export default async function Home() {
  const session = await auth();
  const isTeacher = session?.user?.role === "TEACHER";

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

  // Fetch some featured courses (e.g., top 3 popular)
  const featuredCoursesResponse = await getCourses({}, "popular", 1, 3);
  const featuredCourses = featuredCoursesResponse.data;

  return (
    <main className="flex-1 flex flex-col items-center w-full min-h-[calc(100vh-100px)] relative z-10 pb-24">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center p-4 sm:p-8 md:p-12 mb-20">
        <div className="w-full lg:w-1/2 relative animate-fade-in [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)]">
          <Carousel images={carouselImages} autoScrollInterval={5} />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left animate-fade-in">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-7xl font-family-papernotes text-foreground drop-shadow-sm leading-none">
            Make It With Love
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-xl font-sans" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            The ultimate creative playground for young artists! We believe that the best things in life are handmade. Our platform provides a curated library of high-quality, kid-friendly video tutorials that turn screen time into &quot;hands-on&quot; time.
          </p>
          <Link href={isTeacher ? "/teacher" : "/courses"}>
            <button className="mt-4 px-10 py-4 bg-[#ea7c9d] hover:bg-[#e4552c] text-white font-bold text-3xl rounded-full hover:scale-105 transition-all shadow-xl font-family-papernotes tracking-widest leading-none flex items-center justify-center">
              {isTeacher ? "lets teach!!" : "lets learn!!"}
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Vision & Mission */}
      <section className="w-full bg-white/60 backdrop-blur-md py-24 border-y border-white/40 mb-32 animate-fade-in delay-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="font-family-papernotes text-5xl sm:text-6xl text-[#ea7c9d] mb-6 drop-shadow-sm">
              Our Vision & Mission
            </h2>
            <div className="space-y-6 text-lg text-gray-700" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              <p>
                <strong className="text-[#e4552c]">Vision:</strong> To inspire a generation of young creators who believe in the power of their own two hands. We envision a world where imagination is nurtured, and every child has the confidence to say, &quot;I made this!&quot;
              </p>
              <p>
                <strong className="text-[#32a569]">Mission:</strong> Make It With Love provides safe, engaging, and high-quality crafting education. We combine the magic of storytelling with practical, hands-on skills, empowering children to explore art, pottery, building, and more in a fun and supportive environment.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-80 bg-gradient-to-br from-[#f6e5c4] to-[#ea7c9d]/30 rounded-[3rem] overflow-hidden shadow-inner border-4 border-white flex items-center justify-center">
            <h3 className="font-family-papernotes text-4xl text-white/80 rotate-[-10deg]">
              Creativity Starts Here!
            </h3>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="w-full max-w-5xl px-4 sm:px-8 mb-32 flex flex-col items-center animate-fade-in delay-400">
        <div className="text-center mb-12 relative">
          <div className="absolute -top-6 -left-10 w-16 h-16 bg-[#32a569] rounded-full mix-blend-multiply opacity-20 filter blur-xl"></div>
          <h2 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-sm">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-500 mt-2" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            Explore our most popular crafting adventures!
          </p>
        </div>
        
        <div className="w-full flex flex-col gap-8">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-12">
          <Link href="/courses">
            <button className="px-8 py-3 border-4 border-[#32a569] text-[#32a569] hover:bg-[#32a569] hover:text-white font-bold rounded-full transition-all text-xl" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Explore All Courses
            </button>
          </Link>
        </div>
      </section>

      {/* 4. Subscription CTA Banner */}
      <section className="w-full max-w-7xl px-4 sm:px-8 mb-32 animate-fade-in">
        <div className="bg-gradient-to-r from-[#f79d1c] to-[#e4552c] rounded-[3rem] p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-40px] right-[-40px] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-family-papernotes text-5xl sm:text-6xl mb-4 drop-shadow-md text-[#f6e5c4]">
              Join the Creator&apos;s Club!
            </h2>
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl font-medium" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Want unlimited access to all our magical courses AND live 1-on-1 mentor sessions? Check out our brand new premium subscription!
            </p>
            <Link href="/subscription">
              <button className="px-12 py-5 bg-white text-[#e4552c] hover:bg-[#f6e5c4] hover:text-[#32a569] transition-colors rounded-full font-bold text-2xl shadow-xl hover:-translate-y-1 transform duration-300" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
                View Subscription Plan
              </button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
