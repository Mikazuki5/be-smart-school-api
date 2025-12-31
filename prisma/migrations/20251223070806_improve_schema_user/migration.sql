-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "lastName" TEXT;
