/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `schoolId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `nisn` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- DropIndex
DROP INDEX "Student_nisn_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "schoolId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "nisn",
DROP COLUMN "schoolId";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "schoolId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "schoolId";

-- DropTable
DROP TABLE "School";
