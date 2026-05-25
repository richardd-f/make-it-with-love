import { TeacherRegisterForm } from "@/src/features/auth/components/TeacherRegisterForm";
import Image from "next/image";

export const metadata = {
  title: "Register as Teacher | Make It With Love",
  description: "Join Make It With Love as a teacher and share your craft.",
};

export default function TeacherRegisterPage() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: "4.5s" }}>
        <Image src="/images/assets/circle_orange.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-10 left-10 w-44 h-44 opacity-70 animate-pulse pointer-events-none">
        <Image src="/images/assets/coral1_orange.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-40 left-20 w-24 h-24 opacity-80 animate-bounce pointer-events-none" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
        <Image src="/images/assets/circle_yellow.webp" alt="" fill className="object-contain" />
      </div>

      <div className="w-full animate-fade-in z-10">
        <TeacherRegisterForm />
      </div>
    </main>
  );
}
