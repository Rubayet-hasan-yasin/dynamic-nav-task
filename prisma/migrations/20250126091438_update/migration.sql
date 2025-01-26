/*
  Warnings:

  - You are about to drop the column `menuTitle` on the `Menu` table. All the data in the column will be lost.
  - Added the required column `title` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Menu` DROP COLUMN `menuTitle`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
