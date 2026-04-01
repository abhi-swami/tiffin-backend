import { createClient } from "redis";
import {
  redisPassword,
  redisUrl,
  sessionSecret,
} from "../utils/envVariables";

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required to configure sessions");
}

export const redisClient = createClient({
  url: redisUrl,
  password: redisPassword,
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
