import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AuthFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 403) {
      response.status(status).json({
        statusCode: status,
        error: 'Invalid token.',
      });
    } else {
      response.status(status).json({
        statusCode: status,
        error: exception.message,
      });
    }
  }
}
