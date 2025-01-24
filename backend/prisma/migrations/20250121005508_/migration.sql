/*
  Warnings:

  - You are about to drop the column `obra_id` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `obraId` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentual` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_dia` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_hora` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obraId` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "horas_extras" ADD COLUMN     "obraId" INTEGER NOT NULL,
ADD COLUMN     "percentual" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipo_dia" TEXT NOT NULL,
ADD COLUMN     "valor_hora" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valor_total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "registros_ponto" ADD COLUMN     "obraId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "obra_id",
ADD COLUMN     "obra_atual_id" INTEGER,
ADD COLUMN     "valor_hora" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "obras" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras_usuarios" (
    "id" SERIAL NOT NULL,
    "obra_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obras_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "obras_usuarios_obra_id_usuario_id_key" ON "obras_usuarios"("obra_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_obra_atual_id_fkey" FOREIGN KEY ("obra_atual_id") REFERENCES "obras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras_usuarios" ADD CONSTRAINT "obras_usuarios_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras_usuarios" ADD CONSTRAINT "obras_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_ponto" ADD CONSTRAINT "registros_ponto_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horas_extras" ADD CONSTRAINT "horas_extras_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
