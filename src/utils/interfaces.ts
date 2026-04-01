import { Request } from "express";

export type UserRequest = Request & {
   session: {
    userId?: string;
    userRole?: number;
    authenticatedAt?: string;
  };
  user?: { id: string };
};
