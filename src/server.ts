import "dotenv/config";
import app from "./app";
import { connectToDB, closeDBConnection } from "./db";
import { closeRedisConnection, connectToRedis } from "./config/session";
import { port } from "./utils/envVariables";
import { initializeSocket } from "./config/socket";

async function startServer() {
  try {
    await connectToDB();
    await connectToRedis();

    const { server, ioServer } = initializeSocket(app);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Socket.IO server listening for connections`);
    });

    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;
      console.log(`${signal} received. Shutting down.`);

      server.close(async () => {
        try {
          await closeRedisConnection();
          await closeDBConnection();
          process.exit(0);
        } catch (error) {
          console.error("Error in closing database connection", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => {
      // Interrupt signal (Ctrl + C)
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      // Termination signal
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
