import "dotenv/config";
import { prisma } from "./lib/prisma.js";

async function main() {
  const user = await prisma.user.update({
    where: {
      email: "shikhar@test2.com",
    },
    data: {
      bodyWeight: 64.5,
    },
  });

  console.log("Created User: ", user);

  // const allUsers = await prisma.user.findMany();

  // console.log(allUsers);
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
