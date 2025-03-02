-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Em Andamento';
