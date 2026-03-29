import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
};