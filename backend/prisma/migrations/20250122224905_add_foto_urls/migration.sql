/*
  Warnings:

  - Added the required column `foto_registro` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "horas_extras" ADD COLUMN     "motivo_rejeicao" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "registros_ponto" ADD COLUMN     "foto_registro" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "foto_facial" TEXT;

-- CreateTable
CREATE TABLE "feriados" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feriados_pkey" PRIMARY KEY ("id")
);
