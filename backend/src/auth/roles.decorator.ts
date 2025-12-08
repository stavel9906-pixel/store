import { SetMetadata } from '@nestjs/common';
import { UsersRole } from 'src/enums/userRole.enum';

export const Roles = (...roles: UsersRole[]) => SetMetadata('roles', roles);
