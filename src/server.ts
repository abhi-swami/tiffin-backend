import "dotenv/config";
import app from "./app";
import { closeDatabaseConnection, connectToDatabase } from "./db";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectToDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    let isShuttingDown = false;

    const shutdown = async (signal: string) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;
      console.log(`${signal} received. Shutting down gracefully.`);

      server.close(async () => {
        try {
          await closeDatabaseConnection();
          process.exit(0);
        } catch (error) {
          console.error("Error while closing database connection", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
