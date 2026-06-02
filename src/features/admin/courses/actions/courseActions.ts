'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCourse(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const minAge = parseInt(formData.get('minAge') as string, 10);
  const price = parseFloat(formData.get('price') as string);
  const amountOfMeeting = parseInt(formData.get('amountOfMeeting') as string, 10);

  const imgUrl = formData.get('imgUrl') as string;

  if (!name || isNaN(minAge) || isNaN(price) || isNaN(amountOfMeeting)) {
    return { error: 'Missing required fields or invalid numbers' };
  }

  let course;
  try {
    course = await prisma.course.create({
      data: {
        name,
        description,
        imgUrl,
        minAge,
        price,
        amountOfMeeting,
      },
    });
  } catch (error) {
    console.error('Error creating course', error);
    return { error: 'Failed to create course' };
  }

  revalidatePath('/admin/courses');
  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourse(courseId: string, prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const minAge = parseInt(formData.get('minAge') as string, 10);
  const price = parseFloat(formData.get('price') as string);
  const amountOfMeeting = parseInt(formData.get('amountOfMeeting') as string, 10);

  const imgUrl = formData.get('imgUrl') as string;

  if (!name || isNaN(minAge) || isNaN(price) || isNaN(amountOfMeeting)) {
    return { error: 'Missing required fields or invalid numbers' };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        name,
        description,
        imgUrl,
        minAge,
        price,
        amountOfMeeting,
      },
    });
  } catch (error) {
    console.error('Error updating course', error);
    return { error: 'Failed to update course' };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/admin/courses');
  return { success: 'Course updated successfully' };
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.$transaction([
      prisma.userVideo.deleteMany({ where: { video: { courseId } } }),
      prisma.video.deleteMany({ where: { courseId } }),
      prisma.teacherSchedule.deleteMany({ where: { courseId } }),
      prisma.teacherEnrollment.deleteMany({ where: { courseId } }),
      prisma.enrollment.deleteMany({ where: { courseId } }),
      prisma.wishlist.deleteMany({ where: { courseId } }),
      prisma.cart.deleteMany({ where: { courseId } }),
      prisma.courseKit.deleteMany({ where: { courseId } }),
      prisma.courseCategory.deleteMany({ where: { courseId } }),
      prisma.course.delete({ where: { id: courseId } }),
    ]);
  } catch (error) {
    console.error('Error deleting course', error);
    return { error: 'Failed to delete course' };
  }
  revalidatePath('/admin/courses');
  return { success: 'Course deleted successfully' };
}

export async function toggleCourseCategory(courseId: string, categoryId: string, isAssigned: boolean) {
  try {
    if (isAssigned) {
      await prisma.courseCategory.deleteMany({
        where: {
          courseId,
          categoryId,
        },
      });
    } else {
      await prisma.courseCategory.create({
        data: {
          courseId,
          categoryId,
        },
      });
    }
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error('Error toggling course category', error);
    return { error: 'Failed to update categories' };
  }
}
