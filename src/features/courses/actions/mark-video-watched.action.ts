"use server";

import { auth } from "@/src/auth";
import prisma from "@/src/lib/prisma";

export async function markVideoWatched(videoId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  const userId = session.user.id;

  const existing = await prisma.userVideo.findFirst({ where: { userId, videoId } });
  if (existing) {
    if (!existing.isDone) {
      await prisma.userVideo.update({
        where: { userVideoId: existing.userVideoId },
        data: { isDone: true },
      });
    }
  } else {
    await prisma.userVideo.create({ data: { userId, videoId, isDone: true } });
  }
}
