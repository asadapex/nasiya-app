import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from 'src/common/decorator/role-decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let req: Request = context.switchToHttp().getRequest();

    if (!roles.length) {
      return true;
    }

    if (roles.includes(req['user-role'])) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
