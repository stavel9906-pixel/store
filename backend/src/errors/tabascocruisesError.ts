import { StatusCodes } from "http-status-codes";
import { BaseError } from "./baseError";

export class TabascocruisesError extends Error {
  statusCode: StatusCodes;
  baseError: BaseError;

  constructor(statusCode: StatusCodes, error: string, details: string) {
    super(`${error} - ${details}`);

    this.statusCode = statusCode;
    this.baseError = {
      error,
      details,
    };

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
} 