'use server';

import { signIn, signOut } from '@/src/auth';
export async function logoutUser() {
  await signOut({ redirectTo: '/' });
}
import prisma from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function loginUser(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function registerUser(prevState: string | undefined, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password || !confirmPassword) {
    return 'All fields are required.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return 'Email is already registered.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return 'SUCCESS';
  } catch (error) {
    console.error('Error in registerUser:', error);
    return 'Failed to register user. Please try again later.';
  }
}
