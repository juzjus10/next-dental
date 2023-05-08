/*
  Warnings:

  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `appointment`;

-- DropTable
DROP TABLE `doctor`;

-- DropTable
DROP TABLE `patient`;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(45) NOT NULL,
    `appointment_time` TIME(0) NOT NULL,
    `date_of_appointment` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `patient_id` VARCHAR(191) NOT NULL,
    `doctor_id` VARCHAR(191) NOT NULL,

    INDEX `Appointment_doctor_id_fkey`(`doctor_id`),
    INDEX `Appointment_patient_id_fkey`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(45) NOT NULL,
    `dob` DATE NOT NULL,
    `hire_date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `address` LONGTEXT NOT NULL,
    `age` INTEGER NOT NULL,
    `sex` VARCHAR(20) NOT NULL,
    `civil_status` VARCHAR(20) NOT NULL,
    `dob` DATE NOT NULL,
    `mobile_no` VARCHAR(20) NOT NULL,
    `emergency_contact` VARCHAR(20) NOT NULL,
    `emergency_mobile_no` VARCHAR(191) NOT NULL,
    `medical_history` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` VARCHAR(191) NOT NULL,
    `operating_hours` VARCHAR(191) NOT NULL,
    `clinic_name` VARCHAR(191) NOT NULL,
    `clinic_address` VARCHAR(191) NOT NULL,
    `clinic_contact` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Records` ADD CONSTRAINT `Records_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Records` ADD CONSTRAINT `Records_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
