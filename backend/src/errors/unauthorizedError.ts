import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedError extends HttpException {
  constructor(details: string) {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: details,
        details,
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
