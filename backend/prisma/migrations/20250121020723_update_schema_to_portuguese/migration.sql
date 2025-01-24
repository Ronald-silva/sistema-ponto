/*
  Warnings:

  - You are about to drop the column `motivo` on the `horas_extras` table. All the data in the column will be lost.
  - You are about to drop the column `multiplicador` on the `horas_extras` table. All the data in the column will be lost.
  - You are about to drop the column `obra_id` on the `horas_extras` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `horas_extras` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_dia` on the `horas_extras` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `registros_ponto` table. All the data in the column will be lost.
  - Added the required column `percentual` to the `horas_extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentual` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_dia` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_hora` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `registros_ponto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "horas_extras" DROP CONSTRAINT "horas_extras_obra_id_fkey";

-- DropIndex
DROP INDEX "obras_usuarios_obra_id_usuario_id_key";

-- AlterTable
ALTER TABLE "horas_extras" DROP COLUMN "motivo",
DROP COLUMN "multiplicador",
DROP COLUMN "obra_id",
DROP COLUMN "status",
DROP COLUMN "tipo_dia",
ADD COLUMN     "percentual" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "registros_ponto" DROP COLUMN "data",
ADD COLUMN     "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "percentual" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipo_dia" TEXT NOT NULL,
ADD COLUMN     "valor_hora" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valor_total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "valor_hora" DROP DEFAULT;
