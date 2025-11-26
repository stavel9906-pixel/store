import { StatusCodes } from "http-status-codes";
import { TabascocruisesError } from "./tabascocruisesError";

export class NotFoundError extends TabascocruisesError {
  constructor(details: string) {
    super(StatusCodes.NOT_FOUND, "Not found", details);
  }
} 