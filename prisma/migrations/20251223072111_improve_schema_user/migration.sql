/*
  Warnings:

  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoProfile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "pictureProfile" TEXT,
ADD COLUMN     "religion" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "pictureProfile" TEXT,
ADD COLUMN     "religion" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "gender",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
DROP COLUMN "photoProfile",
DROP COLUMN "religion";
