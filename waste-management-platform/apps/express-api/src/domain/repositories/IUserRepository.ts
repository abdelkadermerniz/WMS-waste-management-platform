import { CreateUserDTO, UserEntity } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserDTO): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<void>;
  findAllByEnterprise(enterpriseId: string): Promise<UserEntity[]>;
  storeRefreshToken(userId: string, token: string): Promise<void>;
  findByRefreshToken(token: string): Promise<UserEntity | null>;
}
