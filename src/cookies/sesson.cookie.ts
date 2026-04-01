import { cookieMaxAge, isProduction } from "../utils/envVariables";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" as const : "lax" as const,
  maxAge: Number.isNaN(cookieMaxAge) ? 60 * 60 * 24 * 7 * 1000 : cookieMaxAge,
  path: "/",
};