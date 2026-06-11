-- CreateEnum
CREATE TYPE "CategoryColor" AS ENUM ('BLUE', 'GREEN', 'ORANGE', 'PINK', 'PURPLE', 'RED', 'SLATE', 'YELLOW');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" "CategoryColor" NOT NULL DEFAULT 'SLATE';
