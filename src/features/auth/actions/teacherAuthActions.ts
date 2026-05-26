"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerTeacher(
  prevState: string | undefined,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const bio = formData.get("bio") as string;
  const expertise = formData.get("expertise") as string;
  const phone = formData.get("phone") as string;
  const photo = formData.get("photo") as string;

  if (!name || !email || !password || !confirmPassword) {
    return "All required fields must be filled.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return "Email is already registered.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
        bio: bio || null,
        expertise: expertise || null,
        phone: phone || null,
        photo: photo || null,
      },
    });

    return "SUCCESS";
  } catch (error) {
    console.error("Error registering teacher:", error);
    return "Failed to register. Please try again.";
  }
}
