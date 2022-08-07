import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'ROLES';

export const GetHasRoles = (...args: string[]) => SetMetadata(META_ROLES, args);
