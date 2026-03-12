import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    console.error('--->>>> AllExceptionsFilterError: ', new Date(), exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Something went wrong, please try again';
    let userFriendlyMessage = message;

    // HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        userFriendlyMessage = exceptionResponse;
      } else if (exceptionResponse instanceof Object) {
        userFriendlyMessage =
          (exceptionResponse as { message: string })?.message ||
          'An error occurred';
      }
    }

    // QueryFailedError
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      if (
        exception.message.includes('violates foreign key constraint') &&
        exception.message.includes('delete')
      ) {
        userFriendlyMessage =
          'Cannot delete this record because it is referenced by other data in the system.';
      } else {
        userFriendlyMessage =
          'A database error occurred. Please contact support.';
      }
    }

    // Type Error
    else if (exception instanceof TypeError) {
      userFriendlyMessage = 'An unexpected error occurred. Please try again.';
    }

    // Duplicate Key
    if (
      (exception as any)?.message?.includes('duplicate key') ||
      (exception as any)?.detail?.includes('already exists')
    ) {
      userFriendlyMessage = 'This record already exists.';
    }

    response.status(status).json({
      statusCode: status,
      status: false,
      message: userFriendlyMessage,
    });
  }
}
