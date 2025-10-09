/*
  Warnings:

  - You are about to drop the column `parameter` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "parameter",
ADD COLUMN     "headers" JSONB,
ADD COLUMN     "parameters" JSONB;
