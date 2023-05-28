-- AlterTable
ALTER TABLE `appointment` MODIFY `date_of_appointment` DATETIME NOT NULL;


-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
