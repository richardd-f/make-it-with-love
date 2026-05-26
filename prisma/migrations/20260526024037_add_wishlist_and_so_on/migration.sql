/*
  Warnings:

  - You are about to drop the column `mentor_availability_id` on the `meeting` table. All the data in the column will be lost.
  - You are about to drop the `mentor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentor_availability` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `wishlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacher_schedule_id` to the `meeting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeacherEnrollmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TeacherScheduleStatus" AS ENUM ('AVAILABLE', 'BOOKED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'TEACHER';

-- DropForeignKey
ALTER TABLE "meeting" DROP CONSTRAINT "meeting_mentor_availability_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_availability" DROP CONSTRAINT "mentor_availability_meeting_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_availability" DROP CONSTRAINT "mentor_availability_mentor_id_fkey";

-- AlterTable
ALTER TABLE "meeting" DROP COLUMN "mentor_availability_id",
ADD COLUMN     "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "teacher_schedule_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "expertise" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "users_subscriptions" ADD COLUMN     "courses_claimed_left" INTEGER NOT NULL DEFAULT 3;

-- DropTable
DROP TABLE "mentor";

-- DropTable
DROP TABLE "mentor_availability";

-- DropEnum
DROP TYPE "MentorAvailabilityStatus";

-- CreateTable
CREATE TABLE "teacher_enrollment" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" "TeacherEnrollmentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_schedule" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "meeting_url" TEXT NOT NULL,
    "status" "TeacherScheduleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_actions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teacher_enrollment_teacher_id_course_id_key" ON "teacher_enrollment"("teacher_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_user_id_course_id_key" ON "enrollment"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_course_id_key" ON "wishlists"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "teacher_enrollment" ADD CONSTRAINT "teacher_enrollment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_enrollment" ADD CONSTRAINT "teacher_enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_schedule" ADD CONSTRAINT "teacher_schedule_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_schedule" ADD CONSTRAINT "teacher_schedule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting" ADD CONSTRAINT "meeting_teacher_schedule_id_fkey" FOREIGN KEY ("teacher_schedule_id") REFERENCES "teacher_schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_actions" ADD CONSTRAINT "user_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
