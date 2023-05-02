/*
  Warnings:

  - You are about to drop the column `doctor_name` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `ammount_paid` on the `records` table. All the data in the column will be lost.
  - Added the required column `amount_paid` to the `Records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `doctor_name`,
    ADD COLUMN `firstname` VARCHAR(191) NULL,
    ADD COLUMN `lastname` VARCHAR(191) NULL,
    ADD COLUMN `middlename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `patient` ADD COLUMN `firstname` VARCHAR(191) NULL,
    ADD COLUMN `lastname` VARCHAR(191) NULL,
    ADD COLUMN `middlename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `records` DROP COLUMN `ammount_paid`,
    ADD COLUMN `amount_paid` FLOAT NOT NULL;
