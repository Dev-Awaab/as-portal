import { Response, Request } from "express"; // Import your winston logger
import logger from "./Logger.utils";
// import { errorHandler } from "../middleware";

export const errorResponse = (
  res: Response,
  req: Request,
  statusCode: number,
  message: string
) => {
  // const response = { message, data };

  // Log the error using the winston logger
  logger.error(` [Status Code: ${statusCode}] ${message}`);

  // return errorHandler(req, res, statusCode, message);
};

export const serverErrorResponse = (
  res: Response,
  context: string,
  err: Error
) => {
  // Log the server error using the winston logger
  logger.error(` [Status Code: 500] [${context}] Internal Server Error`, err);

  const response = { message: "Internal Server Error" };

  return res.status(500).json(response);
};

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  const response = { message, data };

  // Log the success response using the winston logger
  logger.info(` [Status Code: ${statusCode}] ${message}`);

  return res.status(statusCode).json(response);
};
