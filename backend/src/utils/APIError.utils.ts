import BaseError from "./BaseError";
class APIError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(errorCode: string, statusCode: number, message: string) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export default APIError;
