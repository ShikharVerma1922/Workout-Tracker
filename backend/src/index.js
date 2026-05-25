// src/index.js
import { env } from "./config/env.js";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

let server;
let isShuttingDown = false; // <-- 1. Add the state lock

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("🗄️  Database connected successfully");

    server = app.listen(env.PORT, () => {
      console.log(
        `⚙️  Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error("❌ Unhandled Exception/Rejection:", error);
  shutdown();
};

const shutdown = async () => {
  // 2. If we are already shutting down, ignore any further calls!
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("\n⚠️  Initiating graceful shutdown...");

  // 3. Start the 10-second timeout clock immediately
  setTimeout(() => {
    console.error("❌ Shutdown timed out, forcefully exiting.");
    process.exit(1);
  }, 10000);

  try {
    if (server) {
      server.close(async () => {
        console.log("🛑 HTTP server closed.");
        await prisma.$disconnect();
        console.log("🗄️  Database connection closed.");
        process.exit(0);
      });
    } else {
      await prisma.$disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1); // Exit immediately if the shutdown itself fails
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

startServer();
