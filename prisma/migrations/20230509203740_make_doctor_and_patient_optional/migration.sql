-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_doctor_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_patient_id_fkey`;

-- AlterTable
ALTER TABLE `appointment` MODIFY `patient_id` VARCHAR(191) NULL,
    MODIFY `doctor_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
