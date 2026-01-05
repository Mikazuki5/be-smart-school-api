/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,semester,schoolYear]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "dailyTask" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "practicalWork" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "schoolYear" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_subjectId_semester_schoolYear_key" ON "Grade"("studentId", "subjectId", "semester", "schoolYear");
