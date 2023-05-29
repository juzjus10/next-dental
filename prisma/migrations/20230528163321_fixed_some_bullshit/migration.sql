-- AlterTable
ALTER TABLE `appointment` MODIFY `appointment_time` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient` MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `dob` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `records` MODIFY `procedure` VARCHAR(191) NOT NULL,
    MODIFY `doctor_notes` VARCHAR(191) NOT NULL,
    MODIFY `date` DATETIME(0) NOT NULL;
