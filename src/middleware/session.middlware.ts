import session from "express-session";
import { redisClient } from "../config/session";
import { RedisStore } from "connect-redis";

const sessionTtlSeconds = Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24 * 7);
const cookieMaxAge = sessionTtlSeconds * 1000;
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;


if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required to configure sessions");
}


export const sessionMiddleware = session({
  name: process.env.SESSION_COOKIE_NAME || "tiffin.sid",
  store: new RedisStore({
    client: redisClient,
    prefix: process.env.SESSION_PREFIX || "tiffin:sess:",
    ttl: Number.isNaN(sessionTtlSeconds) ? 60 * 60 * 24 * 7 : sessionTtlSeconds,
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: Number.isNaN(cookieMaxAge) ? 60 * 60 * 24 * 7 * 1000 : cookieMaxAge,
  },
});