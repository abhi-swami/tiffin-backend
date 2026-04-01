import { Response, NextFunction } from "express";
import { UserRequest } from "../utils/interfaces";

export const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // console.log("Auth Middleware - Session Data:", req.session  );
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = { id: req.session.userId };
  next();
};
