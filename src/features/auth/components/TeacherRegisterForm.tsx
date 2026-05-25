"use client";

import { useActionState, useEffect, useState } from "react";
import { registerTeacher } from "../actions/teacherAuthActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

export function TeacherRegisterForm() {
  const [resultMessage, formAction, isPending] = useActionState(registerTeacher, undefined);
  const [photoUrl, setPhotoUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (resultMessage === "SUCCESS") {
      router.push("/login");
    }
  }, [resultMessage, router]);

  const inputClass =
    "w-full px-5 py-3 rounded-2xl bg-white/70 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none transition-colors shadow-inner";
  const labelClass = "font-sans font-semibold text-foreground/80 ml-2";

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full max-w-lg mx-auto p-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 relative z-10">
      <h2 className="text-4xl font-family-papernotes text-center text-[var(--color-orange)] drop-shadow-sm">
        Teach With Love!
      </h2>
      <p className="text-center text-gray-500 text-sm font-sans -mt-2">
        Register as a teacher and share your craft.
      </p>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="name">Full Name *</label>
        <input className={inputClass} id="name" type="text" name="name" placeholder="Your Name" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="email">Email *</label>
        <input className={inputClass} id="email" type="email" name="email" placeholder="your@email.com" required />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="phone">Phone Number</label>
        <input className={inputClass} id="phone" type="tel" name="phone" placeholder="+62 8xx xxxx xxxx" />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="expertise">Expertise / Specialty</label>
        <input className={inputClass} id="expertise" type="text" name="expertise" placeholder="e.g. Ceramics, Watercolor, Woodworking" />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="bio">Bio</label>
        <textarea
          className={`${inputClass} resize-none`}
          id="bio"
          name="bio"
          rows={3}
          placeholder="Tell students a little about yourself…"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Profile Photo</label>
        <input type="hidden" name="photo" value={photoUrl} />
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
              setPhotoUrl(result.info.secure_url as string);
            }
          }}
        >
          {({ open }) => (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => open()}
                className="px-6 py-3 rounded-2xl border-2 border-dashed border-[var(--color-orange)]/50 bg-white/50 text-[var(--color-orange)] font-bold hover:border-[var(--color-orange)] transition-colors font-sans text-sm"
              >
                {photoUrl ? "Change Photo" : "Upload Photo"}
              </button>
              {photoUrl && (
                <img src={photoUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-orange)]" />
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="password">Password *</label>
        <input className={inputClass} id="password" type="password" name="password" placeholder="******" required minLength={6} />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="confirmPassword">Confirm Password *</label>
        <input className={inputClass} id="confirmPassword" type="password" name="confirmPassword" placeholder="******" required minLength={6} />
      </div>

      {resultMessage && resultMessage !== "SUCCESS" && (
        <div className="flex items-center gap-2 text-[var(--color-red)] bg-[var(--color-red)]/10 px-4 py-3 rounded-xl">
          <p className="text-sm font-medium">{resultMessage}</p>
        </div>
      )}

      <button
        aria-disabled={isPending}
        type="submit"
        className="mt-2 w-full py-4 bg-[var(--color-orange)] hover:bg-[var(--color-red)] text-white font-bold text-2xl rounded-full hover:scale-[1.02] transition-all shadow-lg font-family-papernotes tracking-widest leading-none flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
      >
        {isPending ? "Registering…" : "Register as Teacher"}
      </button>

      <div className="text-center mt-2 font-sans text-sm text-foreground/70">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-pink)] font-bold hover:underline">
          Login here
        </Link>
      </div>
      <div className="text-center font-sans text-sm text-foreground/70">
        Student?{" "}
        <Link href="/register" className="text-[var(--color-green)] font-bold hover:underline">
          Register as student
        </Link>
      </div>
    </form>
  );
}
