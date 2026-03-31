declare module "express-session" {
  import { RequestHandler } from "express";

  interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean | "auto";
    sameSite?: boolean | "lax" | "strict" | "none";
    maxAge?: number;
  }

  interface SessionData {
    cookie: CookieOptions;
    user?: {
      phone: string;
    };
    authenticatedAt?: string;
  }

  interface Session extends SessionData {
    id: string;
    regenerate(callback: (error?: unknown) => void): void;
    destroy(callback: (error?: unknown) => void): void;
    reload(callback: (error?: unknown) => void): void;
    save(callback: (error?: unknown) => void): void;
    touch(): void;
  }

  interface SessionOptions {
    name?: string;
    secret: string;
    store?: unknown;
    resave?: boolean;
    saveUninitialized?: boolean;
    rolling?: boolean;
    cookie?: CookieOptions;
  }

  class Store {}

  function session(options: SessionOptions): RequestHandler;

  export { Session, SessionData, SessionOptions, Store };
  export = session;
}

declare global {
  namespace Express {
    interface Request {
      session: import("express-session").Session;
      sessionID: string;
    }
  }
}

export {};
