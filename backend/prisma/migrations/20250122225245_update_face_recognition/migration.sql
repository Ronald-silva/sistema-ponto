/*
  Warnings:

  - You are about to drop the column `foto_registro` on the `registros_ponto` table. All the data in the column will be lost.
  - You are about to drop the column `foto_facial` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "registros_ponto" DROP COLUMN "foto_registro";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "foto_facial",
ADD COLUMN     "descritor_facial" TEXT;
