/*
  Warnings:

  - Added the required column `course_id` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "course_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
