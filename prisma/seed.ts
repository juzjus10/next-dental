import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { hash } from "bcrypt";

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
      password: await hash(password, 10),
    },
  });

//    const settings = await prisma.settings.create({

//    });
  console.log(`Created user with id: ${user.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
