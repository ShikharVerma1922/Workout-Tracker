import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("🗄️  Database connected successfully");

    app.listen(PORT, () => {
      console.log(`⚙️  Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Kill the Node process if the DB is down
  }
};

startServer();
