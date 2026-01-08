import "dotenv/config";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "First task",
        description: "Sample created by seed",
        assignee: "me",
        dueDate: "2026-01-31",
        status: "TODO",
      },
      {
        title: "Check DONE view",
        description: "Verify DONE status rendering",
        assignee: "",
        dueDate: "",
        status: "DONE",
      },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
