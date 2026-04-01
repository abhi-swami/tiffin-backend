import crypto from "node:crypto";
import {
  cookieMaxAge,
  isProduction,
  roleCookieName,
  roleCookieSecret,
} from "../utils/envVariables";

if (!roleCookieSecret) {
  throw new Error("ROLE_COOKIE_SECRET is required to configure the role cookie");
}

export const roleCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" as const : "lax" as const,
  maxAge: Number.isNaN(cookieMaxAge) ? 60 * 60 * 24 * 7 * 1000 : cookieMaxAge,
  path: "/",
};

const sign = (value: string) => {
  if (typeof roleCookieSecret == "string") {

    return crypto.createHmac("sha256", roleCookieSecret).update(value).digest("base64url");
  }

}

export const createSignedRoleCookieValue = (role: number | string) => {
  const payload = String(role);
  return `${payload}.${sign(payload)}`;
};

export const verifySignedRoleCookieValue = (signedValue: string) => {
  const separatorIndex = signedValue.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return null;
  }

  const payload = signedValue.slice(0, separatorIndex);
  const signature = signedValue.slice(separatorIndex + 1);
  const expectedSignature:any = sign(payload);
  const providedSignature = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedSignature, expectedSignatureBuffer)) {
    return null;
  }

  return payload;
};
