import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/get-has-roles.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly refletor: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new UnauthorizedException();

    const hasRoles = this.refletor.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    console.log(hasRoles);

    return user.roles.some((role) => hasRoles.includes(role));
  }
}
