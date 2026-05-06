"use client";

import { useState } from "react";
import { trackEvent } from "@/src/actions/track-event.action";

interface SubscribeButtonProps {
  planName: string;
}

export function SubscribeButton({ planName }: SubscribeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    setIsClicked(true);
    await trackEvent("BUY_SUBSCRIPTION_CLICK", planName);
    
    // For MVP, we just show a thank you message or alert
    alert("Thank you for your interest! This feature is coming soon.");
    setIsClicked(false);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isClicked}
      className={`relative w-full overflow-hidden rounded-full py-5 px-8 font-bold text-2xl transition-all duration-300 transform shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
        isClicked ? "bg-[#32a569] text-white" : "bg-gradient-to-r from-[#e4552c] to-[#f79d1c] text-white"
      }`}
      style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
    >
      <div className="relative z-10 flex items-center justify-center gap-3">
        {isClicked ? (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Registered Interest!
          </>
        ) : (
          <>
            <span className="tracking-wide">Subscribe Now</span>
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </>
        )}
      </div>
      
      {/* Shine effect */}
      <div 
        className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
          isHovered ? "translate-x-full" : ""
        }`}
      />
    </button>
  );
}
