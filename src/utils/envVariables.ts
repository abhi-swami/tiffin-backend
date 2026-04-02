export const nodeEnv = process.env.NODE_ENV || "development";
export const isProduction = nodeEnv === "production";

export const corsOrigin = process.env.CORS_ORIGIN || "";
export const allowedOrigins = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const port = Number(process.env.PORT) || 5000;
export const databaseUrl = process.env.DATABASE_URL;
export const firebaseApiKey = process.env.FIREBASE_API_KEY || "";

export const redisHost = process.env.REDIS_HOST || "127.0.0.1";
export const redisPort = Number(process.env.REDIS_PORT || 6379);
export const redisUrl =
  process.env.REDIS_URL ||
  `redis://${redisHost}:${Number.isNaN(redisPort) ? 6379 : redisPort}`;
export const redisPassword = process.env.REDIS_PASSWORD || undefined;

export const sessionSecret = process.env.SESSION_SECRET;
export const sessionPrefix = process.env.SESSION_PREFIX || "tiffin:sess:";
export const sessionCookieName = process.env.SESSION_COOKIE_NAME || "tiffin.sid";
export const sessionTtlSeconds = Number(
  process.env.SESSION_TTL_SECONDS || 60 * 60 * 24 * 7
);
export const cookieMaxAge = sessionTtlSeconds * 1000;

export const roleCookieSecret = process.env.ROLE_COOKIE_SECRET || process.env.SESSION_SECRET;
export const roleCookieName = process.env.ROLE_COOKIE_NAME || "tiffin.role";

export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
export const awsRegion = process.env.AWS_REGION || "";
export const awsS3Bucket = process.env.AWS_S3_BUCKET || "";
export const awsS3Endpoint = process.env.AWS_S3_ENDPOINT || "";
