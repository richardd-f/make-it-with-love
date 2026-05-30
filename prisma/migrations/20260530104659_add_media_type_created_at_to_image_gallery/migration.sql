-- AlterTable
ALTER TABLE "image_gallery" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "media_type" TEXT NOT NULL DEFAULT 'image';
