import { StatusCodes } from "http-status-codes";
import { TabascocruisesError } from "./tabascocruisesError";

export class UnauthorizedError extends TabascocruisesError {
  constructor(details: string) {
    super(StatusCodes.UNAUTHORIZED, "Unauthorized", details);
  }
} 