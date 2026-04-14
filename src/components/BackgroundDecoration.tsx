"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function BackgroundDecoration() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Mouse move parallax for circles
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 2; // Range -1 to 1
        const yPos = (clientY / window.innerHeight - 0.5) * 2; // Range -1 to 1
        
        elementsRef.current.forEach((el, index) => {
          if (!el) return;
          const depthX = (index + 1) * 30; 
          const depthY = (index + 1) * 30;

          gsap.to(el, {
            x: xPos * depthX,
            y: yPos * depthY,
            duration: 1.5,
            ease: "power2.out"
          });
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // 2. Scroll Parallax for corals
      scrollElementsRef.current.forEach((el, index) => {
        if (!el) return;
        const depth = (index + 1) * -150;
        gsap.to(el, {
          y: depth,
          rotation: (index + 1) * 15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom top", 
            scrub: 2,
          }
        });
      });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    if (elementsRef.current) {
      elementsRef.current[index] = el;
    }
  };

  const setScrollRef = (index: number) => (el: HTMLDivElement | null) => {
    if (scrollElementsRef.current) {
      scrollElementsRef.current[index] = el;
    }
  };


  return (
    <div ref={containerRef} className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden select-none">
      {/* Circle decorations (Mouse parallax) */}
      <div ref={setRef(0)} className="absolute top-[-5%] right-[-5%] opacity-40 blur-[2px]">
        <Image src="/images/assets/circle_orange.webp" alt="Decoration" width={400} height={400} priority />
      </div>
      
      <div ref={setRef(1)} className="absolute bottom-[-10%] left-[-5%] opacity-30">
        <Image src="/images/assets/circle_pink.webp" alt="Decoration" width={350} height={350} />
      </div>

      <div ref={setRef(2)} className="absolute top-[40%] left-[10%] opacity-20 blur-[1px]">
        <Image src="/images/assets/circle_green.webp" alt="Decoration" width={150} height={150} />
      </div>

      {/* Coral decorations (Scroll parallax) */}
      <div ref={setScrollRef(0)} className="absolute top-[20%] right-[10%] opacity-25">
        <Image src="/images/assets/coral1_orange.webp" alt="Coral Decoration" width={200} height={200} />
      </div>

      <div ref={setScrollRef(1)} className="absolute top-[60%] left-[20%] opacity-20 blur-[1px]">
        <Image src="/images/assets/coral2_pink.webp" alt="Coral Decoration" width={250} height={250} />
      </div>
      
      <div ref={setScrollRef(2)} className="absolute top-[80%] right-[15%] opacity-30">
        <Image src="/images/assets/coral1_green.webp" alt="Coral Decoration" width={180} height={180} />
      </div>
    </div>
  );
}
