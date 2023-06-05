import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = 'genepol101';
  const user = await prisma.user.create({
    data: {
      email: 'genepoldente@gmail.com',
      id: uuid(),
      firstname: 'genepolly',
      middlename: 'p',
      lastname: 'dental',
      user_level: 'admin',
      username: 'genepoldente',
      password: hashSync(password, 10),
    },
  });

 
  console.log(`Created user with id: ${user.id}`);

  const settings = await prisma.settings.create({
    data: {
      id: uuid(),
      opening_time: '8:00 AM',
      closing_time: '5:00 PM',
      clinic_name: 'M.C. Dental Clinic',
      clinic_address: 'Manila City',
      clinic_contact: '09123456789',
    
    },
  });

  console.log(`Created settings with id: ${settings.id}`);
  
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
