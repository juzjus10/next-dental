/*
  Warnings:

  - Made the column `firstname` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `middlename` on table `doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstname` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `middlename` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `doctor` MODIFY `firstname` VARCHAR(191) NOT NULL,
    MODIFY `lastname` VARCHAR(191) NOT NULL,
    MODIFY `middlename` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient` MODIFY `firstname` VARCHAR(191) NOT NULL,
    MODIFY `lastname` VARCHAR(191) NOT NULL,
    MODIFY `middlename` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `opening_time` VARCHAR(191) NULL,
    `closing_time` VARCHAR(191) NULL,
    `clinic_name` VARCHAR(191) NOT NULL,
    `clinic_address` VARCHAR(191) NOT NULL,
    `clinic_contact` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
