import { NextFunction, Request, Response } from "express";
import { logger } from "../utils";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.message, error);
  res.status(500).json({
    timestamp: new Date().toISOString(),
    error: error.message,
    path: req.originalUrl,
  });
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    timestamp: new Date().toISOString(),
    error: error.message,
    path: req.originalUrl,
  });
};
