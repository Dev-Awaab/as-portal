import { Response } from "express";

export function sendJsonResponse(
  res: Response,
  statusCode: number,
  message?: string,
  data?: any
) {
  return res.status(statusCode).json({ message, data });
}

export function sendErrorResponse(
  res: Response,
  statusCode: number,
  message?: string,
  data?: any
) {
  return res.status(statusCode).json({ message, data });
}
