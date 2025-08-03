import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      throw new UnauthorizedException({ message: 'Token not provided' });
    }

    try {
      const data = this.jwt.verify(token);
      req['user-id'] = data.id;
      req['user-role'] = data.role;

      return true;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Wrong credentials' });
    }
  }
}
