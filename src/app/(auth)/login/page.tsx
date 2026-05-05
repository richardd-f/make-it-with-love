import { LoginForm } from "@/src/features/auth/components/LoginForm";
import Image from "next/image";

export const metadata = {
  title: "Login | Make It With Love",
  description: "Log in to your Make It With Love account to continue learning and creating.",
};

export default function LoginPage() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
        <Image src="/images/assets/circle_pink.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-20 right-10 w-40 h-40 opacity-70 animate-pulse pointer-events-none">
        <Image src="/images/assets/coral1_green.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: '3s', animationDelay: '1s' }}>
        <Image src="/images/assets/circle_yellow.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-40 left-20 w-36 h-36 opacity-60 animate-pulse pointer-events-none">
        <Image src="/images/assets/coral2_orange.webp" alt="" fill className="object-contain" />
      </div>

      <div className="w-full animate-fade-in z-10">
        <LoginForm />
      </div>
    </main>
  );
}
