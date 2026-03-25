import { UserRole } from "../value-objects/enums";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enterpriseId?: string;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDTO = Omit<
  UserEntity,
  "id" | "isActive" | "createdAt" | "updatedAt" | "refreshToken"
>;
