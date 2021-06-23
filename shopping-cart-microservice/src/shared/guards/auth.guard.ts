import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpService,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private httpService: HttpService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;
      const [_, token] = authorization.split(' ');
      const { data } = await this.httpService
        .post<{ userId: string }>('/validateToken', {
          accessToken: token,
        })
        .toPromise();
      request.body = { ...request.body, userId: data.userId };
      return true;
    } catch (error) {
      return false;
    }
  }
}
