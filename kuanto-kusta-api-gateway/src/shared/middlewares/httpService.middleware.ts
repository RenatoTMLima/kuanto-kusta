import { Injectable, NestMiddleware, HttpService } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpServiceMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.httpService.axiosRef.interceptors.request.use((request) => {
      request.headers = {
        ...request.headers,
        Authorization: req.headers.authorization || '',
      };
      return request;
    });
    next();
  }
}
