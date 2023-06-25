import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // const password = 'genepol101';
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'genepoldente@gmail.com',
  //     id: uuid(),
  //     firstname: 'genepol',
  //     middlename: 'polly',
  //     lastname: 'dental',
  //     user_level: 'admin',
  //     username: 'genepoldente',
  //     password: hashSync(password, 10),
  //   },
  // });

  // console.log(`Created user with id: ${user.id}`);

  // const settings = await prisma.settings.create({
  //   data: {
  //     id: uuid(),
  //     opening_time: '8:00 AM',
  //     closing_time: '5:00 PM',
  //     clinic_name: 'M.C. Dental Clinic',
  //     clinic_address: 'Manila City',
  //     clinic_contact: '09123456789',

  //   },
  // });

  // console.log(`Created settings with id: ${settings.id}`);

 
  const services = await prisma.service.deleteMany();

  const service = await createServices();
 
}
async function createServices() {


  const service = [
    {
      category: "treatment",
      services: [
        {
          id: uuid(),
          name: "Jacket Crown 1st Visit",
          duration: 60,
          cost: 18000
        },
        {
          id: uuid(),
          name: "Jacket Crown Trial",
          duration: 30,
          cost: 2000
        },
        {
          id: uuid(),
          name: "Retainer 1st Visit",
          duration: 30,
          cost: 20000
        },
        {
          id: uuid(),
          name: "Retainer Trial",
          duration: 30,
          cost: 8625
        },
        {
          id: uuid(),
          name: "Braces Installment",
          duration: 90,
          cost: 30000
        },
        {
          id: uuid(),
          name: "Dentures",
          duration: 30,
          cost: 12000
        },
        {
          id: uuid(),
          name: "Dentures Trial",
          duration: 30,
          cost: 5000
        },
        {
          id: uuid(),
          name: "Surgery (Odontectomy)",
          duration: 60,
          cost: 40000
        },
        {
          id: uuid(),
          name: "Gingrectomy",
          duration: 60,
          cost: 5000
        },
        {
          id: uuid(),
          name: "Braces Adjustment",
          duration: 15,
          cost: 1000
        },
        {
          id: uuid(),
          name: "Extraction",
          duration: 30,
          cost: 5000
        },
        {
          id: uuid(),
          name: "Cleaning",
          duration: 30,
          cost: 1700
        },
        {
          id: uuid(),
          name: "Restoration (Pasta)",
          duration: 60,
          cost: 13500
        },
       
      ],
    }, {
      category: "medicine",
      services: [
        {
          id: uuid(),
          name: "Local Anesthesia",
          duration: 0,
          cost: 1000
        },
        {
          id: uuid(),
          name: "Analgesic",
          duration: 0,
          cost: 300
        },
        {
          id: uuid(),
          name: "Antibiotic",
          duration: 0,
          cost: 150
        },
        {
          id: uuid(),
          name: "Antimicrobial Mouth Rinse", 
          duration: 0,
          cost: 500
        },
        {
          id: uuid(),
          name: "Topical Anesthetic",
          duration: 0,
          cost: 600
        },
      ],
    }, {
      category: "material",
      services: [
        {
          id: uuid(),
          name: "Temporary Cement (crown)",
          duration: 0,
          cost: 2500
        }, {
          id: uuid(),
          name: "Acrylic Resin (Crown)",
          duration: 0,
          cost: 2260
        }, {
          id: uuid(),
          name: "Articulating Paper",
          duration: 0,
          cost: 150
        }, 
        {
          id: uuid(),
          name: "Acrylic (retainer)",
          duration: 0,
          cost: 3000
        },
        {
          id: uuid(),
          name: "Wire (retainer)",
          duration: 0,
          cost: 2600
        },
        {
          id: uuid(),
          name: "Bracket",
          duration: 0,
          cost: 150
        },
        {
          id: uuid(),
          name: "Archwire",
          duration: 0,
          cost: 200
        },
        {
          id: uuid(),
          name: "Ligatures",
          duration: 0,
          cost: 200
        },
        {
          id: uuid(),
          name: "Infection Control",
          duration: 0,
          cost: 300
        },
      ]
    }
  ];

  const res = await Promise.all(service.map(async (service) => {
    const { category, services } = service;
    const createdServices = await Promise.all(services.map(async (s) => {
      const { id, name, duration, cost } = s;
      const createdService = await prisma.service.create({
        data: {
          id,
          name,
          duration,
          category,
          cost,
        },
      });
      return createdService;
    }));
    return createdServices;
  }));
  
  console.log(res);
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
