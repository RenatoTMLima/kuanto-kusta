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
      await this.httpService
        .post('/validateToken', {
          accessToken: token,
        })
        .toPromise();
      return true;
    } catch (error) {
      return false;
    }
  }
}
