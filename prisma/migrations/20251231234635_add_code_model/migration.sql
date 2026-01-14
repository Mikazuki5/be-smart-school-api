/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "code" TEXT NOT NULL DEFAULT 'NULL';

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");
