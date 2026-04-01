import session from "express-session";
import { redisClient } from "../config/session";
import { RedisStore } from "connect-redis";
import {
  sessionCookieName,
  sessionPrefix,
  sessionSecret,
  sessionTtlSeconds,
} from "../utils/envVariables";
import { sessionCookieOptions } from "../cookies/sesson.cookie";



if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required to configure sessions");
}

export const sessionMiddleware = session({
  name: sessionCookieName,
  store: new RedisStore({
    client: redisClient,
    prefix: sessionPrefix,
    ttl: Number.isNaN(sessionTtlSeconds) ? 60 * 60 * 24 * 7 : sessionTtlSeconds,
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: sessionCookieOptions,
});
