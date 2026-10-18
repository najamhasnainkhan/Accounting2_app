import { PrismaClient, CategoryType } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const demoPassword = process.env.DEMO_USER_PASSWORD;

  if (!demoPassword) {
    console.log("Skipping demo user seed: DEMO_USER_PASSWORD is not set");
    return;
  }

  const email = "demo@example.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user already exists");
    return;
  }

  const passwordHash = await hashPassword(demoPassword);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email,
      passwordHash,
      company: {
        create: {
          name: "Demo Company",
          email,
          currency: "PKR",
          country: "Pakistan",
        },
      },
    },
    include: { company: true },
  });

  if (user.company) {
    await prisma.category.createMany({
      data: [
        { companyId: user.company.id, name: "Sales", type: CategoryType.INCOME },
        { companyId: user.company.id, name: "Services", type: CategoryType.INCOME },
        { companyId: user.company.id, name: "Rent", type: CategoryType.EXPENSE },
        { companyId: user.company.id, name: "Utilities", type: CategoryType.EXPENSE },
        { companyId: user.company.id, name: "Office Supplies", type: CategoryType.EXPENSE },
      ],
    });
  }

  console.log(`Created demo user: ${email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
