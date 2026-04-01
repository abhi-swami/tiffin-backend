import { Response, NextFunction } from "express";
import { UserRequest } from "../utils/interfaces";

export const roleMiddleware = (allowedRoles: number[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {


    if (
      req.session.userRole === undefined ||
      typeof req.session.userRole !== "number" ||
      !allowedRoles.includes(req.session.userRole)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
