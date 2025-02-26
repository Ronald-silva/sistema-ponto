/*
  Warnings:

  - You are about to drop the column `description` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `overtime_rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('ENTRY', 'EXIT');

-- CreateEnum
CREATE TYPE "OvertimeType" AS ENUM ('WEEKDAY', 'NIGHT_SHIFT', 'SUNDAY_HOLIDAY');

-- DropForeignKey
ALTER TABLE "overtime_rules" DROP CONSTRAINT "overtime_rules_projectId_fkey";

-- DropIndex
DROP INDEX "overtime_rules_projectId_idx";

-- AlterTable
ALTER TABLE "overtime_rules" DROP COLUMN "type",
ADD COLUMN     "type" "OvertimeType" NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "description",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "estimated_end_date" TIMESTAMP(3),
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "admission_date" TIMESTAMP(3),
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "salary" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "time_records" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" "RecordType" NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_rules" ADD CONSTRAINT "overtime_rules_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
