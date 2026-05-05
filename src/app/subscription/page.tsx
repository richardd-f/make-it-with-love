import Link from "next/link";
import { SubscribeButton } from "@/src/features/subscription/components/subscribe-button";

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="font-family-papernotes text-5xl sm:text-7xl text-[#f79d1c] drop-shadow-md mb-4">
          Join the Creator&apos;s Club!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          Unlock unlimited access to all of our magical crafting courses and connect with expert mentors. Let&apos;s make something amazing together!
        </p>
      </div>

      {/* Pricing Card */}
      <div className="w-full max-w-lg relative animate-fade-in [animation-delay:200ms]">
        
        {/* Decorative elements behind the card */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#ea7c9d] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f79d1c] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-32 h-32 bg-[#32a569] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* The Card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border-4 border-[#f6e5c4] p-8 sm:p-12 overflow-hidden flex flex-col items-center text-center">
          
          {/* Ribbon */}
          <div className="absolute top-8 right-[-45px] bg-[#32a569] text-white font-bold py-1.5 px-12 rotate-45 text-sm uppercase tracking-widest shadow-md" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
            Best Value
          </div>

          <div className="mb-8">
            <h2 className="font-family-papernotes text-4xl text-[#ea7c9d] mb-2">Premium Crafter</h2>
            <div className="flex items-end justify-center gap-1 mb-4">
              <span className="text-5xl font-black text-gray-800" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>$12.99</span>
              <span className="text-xl text-gray-500 font-medium mb-1" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>/month</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 mb-10 text-left">
            <FeatureItem text="Unlimited access to all video courses" />
            <FeatureItem text="2 live 1-on-1 mentor sessions per month" />
            <FeatureItem text="Exclusive digital project templates" />
            <FeatureItem text="Cancel anytime, no strings attached!" />
          </div>

          <SubscribeButton planName="Premium Crafter MVP" />
          
        </div>
      </div>

    </main>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 text-gray-700" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f6e5c4] flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32a569" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}
