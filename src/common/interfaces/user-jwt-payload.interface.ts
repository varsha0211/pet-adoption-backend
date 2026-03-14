import { UserRole } from '../enums/roles.enum';

export interface UserJwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  isActive: boolean;
}
