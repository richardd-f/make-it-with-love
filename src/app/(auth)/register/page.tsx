import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import Image from "next/image";

export const metadata = {
  title: "Register | Make It With Love",
  description: "Create your Make It With Love account and start your creative journey.",
};

export default function RegisterPage() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: '4.5s' }}>
        <Image src="/images/assets/circle_green.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-10 left-10 w-44 h-44 opacity-70 animate-pulse pointer-events-none">
        <Image src="/images/assets/coral1_pink.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-40 left-20 w-24 h-24 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <Image src="/images/assets/circle_red.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-32 right-20 w-36 h-36 opacity-60 animate-pulse pointer-events-none">
        <Image src="/images/assets/coral2_red.webp" alt="" fill className="object-contain" />
      </div>

      <div className="w-full animate-fade-in z-10">
        <RegisterForm />
      </div>
    </main>
  );
}
