'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addVideoToCourse(prevState: any, formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const url = formData.get('url') as string;

  if (!courseId || !title || !url) {
    return { error: 'Missing required fields' };
  }

  try {
    await prisma.video.create({
      data: {
        courseId,
        title,
        description,
        url,
      },
    });
    
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: 'Video added successfully!' };
  } catch (error) {
    console.error('Error adding video to course', error);
    return { error: 'Failed to add video to course' };
  }
}

export async function deleteVideoFromCourse(videoId: string, courseId: string) {
  try {
    await prisma.video.delete({
      where: { id: videoId }
    });
    
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting video', error);
    return { error: 'Failed to delete video' };
  }
}

export async function updateVideoInCourse(prevState: any, formData: FormData) {
  const videoId = formData.get('videoId') as string;
  const courseId = formData.get('courseId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const url = formData.get('url') as string;

  if (!videoId || !courseId || !title || !url) {
    return { error: 'Missing required fields' };
  }

  try {
    await prisma.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
        url,
      },
    });
    
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: 'Video updated successfully!' };
  } catch (error) {
    console.error('Error updating video', error);
    return { error: 'Failed to update video' };
  }
}
