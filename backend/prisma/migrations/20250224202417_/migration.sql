/*
  Warnings:

  - You are about to drop the column `active` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_end_date` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `user_projects` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_projects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_projects` table. All the data in the column will be lost.
  - You are about to drop the column `faceId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `overtime_rules` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "overtime_rules" DROP CONSTRAINT "overtime_rules_projectId_fkey";

-- DropIndex
DROP INDEX "users_faceId_key";

-- Adiciona as novas colunas
ALTER TABLE "projects" ADD COLUMN "description" TEXT;
ALTER TABLE "projects" ADD COLUMN "companyId" TEXT DEFAULT '1';

-- Remove as colunas antigas
ALTER TABLE "projects" DROP COLUMN "location";
ALTER TABLE "projects" DROP COLUMN "company";
ALTER TABLE "projects" DROP COLUMN "category";
ALTER TABLE "projects" DROP COLUMN "start_date";
ALTER TABLE "projects" DROP COLUMN "estimated_end_date";
ALTER TABLE "projects" DROP COLUMN "active";

-- Torna a coluna companyId obrigatória
ALTER TABLE "projects" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "projects" ALTER COLUMN "companyId" DROP DEFAULT;

-- Altera a tabela user_projects
ALTER TABLE "user_projects" DROP COLUMN "assignedBy";
ALTER TABLE "user_projects" DROP COLUMN "updatedAt";
ALTER TABLE "user_projects" DROP COLUMN "createdAt";
ALTER TABLE "user_projects" ADD COLUMN "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove a tabela overtime_rules
DROP TABLE "overtime_rules";

-- Remove o enum OvertimeType
DROP TYPE "OvertimeType";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "faceId";
