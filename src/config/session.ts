import { createClient } from "redis";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required to configure sessions");
}

const redisPort = Number(process.env.REDIS_PORT || 6379);

export const redisClient = createClient({
  url:
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
      Number.isNaN(redisPort) ? 6379 : redisPort
    }`,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("error", (error) => {
  console.error("Redis session client error", error);
});


let redisConnectPromise: ReturnType<typeof redisClient.connect> | null = null;

export const connectToRedis = async () => {
  if (redisClient.isOpen) {
    return;
  }

  if (redisConnectPromise===null) {
    redisConnectPromise = redisClient.connect().finally(() => {
      redisConnectPromise = null;
    });
  }

  await redisConnectPromise;
};

export const closeRedisConnection = async () => {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.quit();
};

