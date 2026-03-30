import "dotenv/config";
import app from "./app";
import { connectToDB, closeDBConnection } from "./db";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectToDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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
