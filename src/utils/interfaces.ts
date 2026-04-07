import { pgEnum } from "drizzle-orm/pg-core";
import { Request } from "express";

export type UserRequest = Request & {
  session: {
    userId?: string;
    userRole?: number | null;
    authenticatedAt?: string;
  };
  user?: { id: string };
  file?: Express.Multer.File;
  files?: Request["files"];
};
