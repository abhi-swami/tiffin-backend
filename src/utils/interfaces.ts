import { Request } from "express";

export type UserRequest = Request & {
   session: {
    userId?: string;
    authenticatedAt?: string;
  };
  user?: { id: string };
};
