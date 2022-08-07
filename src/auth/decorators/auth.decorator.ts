import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { GetHasRoles } from './get-has-roles.decorator';

export function Auth(...roles: string[]) {
  return applyDecorators(
    GetHasRoles(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
