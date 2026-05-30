/*
  Warnings:

  - A unique constraint covering the columns `[user_id,course_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transaction_details" ADD COLUMN     "course_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_course_id_key" ON "carts"("user_id", "course_id");
