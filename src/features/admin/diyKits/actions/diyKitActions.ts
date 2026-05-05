'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createDiyKit(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);

  if (!name || isNaN(price) || isNaN(stock)) {
    return { error: 'Missing required fields or invalid numbers' };
  }

  try {
    await prisma.diyKit.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });
    revalidatePath('/admin/diyKits');
    return { success: 'DIY Kit created successfully' };
  } catch (error) {
    console.error('Error creating DIY kit', error);
    return { error: 'Failed to create DIY kit' };
  }
}

export async function updateDiyKit(kitId: string, prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);

  if (!name || isNaN(price) || isNaN(stock)) {
    return { error: 'Missing required fields or invalid numbers' };
  }

  try {
    await prisma.diyKit.update({
      where: { id: kitId },
      data: {
        name,
        description,
        price,
        stock,
      },
    });
    revalidatePath('/admin/diyKits');
    return { success: 'DIY Kit updated successfully' };
  } catch (error) {
    console.error('Error updating DIY kit', error);
    return { error: 'Failed to update DIY kit' };
  }
}

export async function deleteDiyKit(kitId: string) {
  try {
    await prisma.diyKit.delete({
      where: { id: kitId },
    });
    revalidatePath('/admin/diyKits');
    return { success: true };
  } catch (error) {
    console.error('Error deleting DIY kit', error);
    return { error: 'Failed to delete DIY kit. It might be assigned to a course.' };
  }
}

export async function toggleDiyKitForCourse(courseId: string, diyKitsId: string, isAssigned: boolean) {
  try {
    if (isAssigned) {
      await prisma.courseKit.deleteMany({
        where: {
          courseId,
          diyKitsId,
        },
      });
    } else {
      await prisma.courseKit.create({
        data: {
          courseId,
          diyKitsId,
        },
      });
    }
    revalidatePath(`/admin/courses/${courseId}/diyKits`);
    return { success: true };
  } catch (error) {
    console.error('Error toggling course kit', error);
    return { error: 'Failed to update Course DIY kits' };
  }
}
