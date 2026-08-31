import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const promises: any[] = [];
  const categories = [
    { name: "Food & Drinks", icon: "fast-food" },
    { name: "Shopping", icon: "cart" },
    { name: "Transportation", icon: "car" },
    { name: "Entertainment", icon: "film" },
    { name: "Bills", icon: "receipt" },
    { name: "Income", icon: "cash" },
    { name: "Other", icon: "ellipsis-horizontal" },
  ];
  categories.forEach((item) => {
    promises.push(
      prisma.category.create({
        data: {
          name: item.name,
          icon: item.icon,
        },
      }),
    );
  });
  await Promise.all(promises);
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
