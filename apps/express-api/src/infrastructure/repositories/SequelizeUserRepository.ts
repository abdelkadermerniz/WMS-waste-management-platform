import { CreateUserDTO, UserEntity } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../models/UserModel";

const toEntity = (model: UserModel): UserEntity => ({
  id: model.id,
  email: model.email,
  passwordHash: model.passwordHash,
  firstName: model.firstName,
  lastName: model.lastName,
  role: model.role,
  enterpriseId: model.enterpriseId,
  isActive: model.isActive,
  refreshToken: model.refreshToken ?? undefined,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
});

export class SequelizeUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const m = await UserModel.findByPk(id);
    return m ? toEntity(m) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const m = await UserModel.findOne({ where: { email } });
    return m ? toEntity(m) : null;
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const m = await UserModel.create({
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      enterpriseId: data.enterpriseId,
    });
    return toEntity(m);
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const m = await UserModel.findByPk(id);
    if (!m) return null;
    await m.update(data);
    return toEntity(m);
  }

  async delete(id: string): Promise<void> {
    await UserModel.destroy({ where: { id } });
  }

  async findAllByEnterprise(enterpriseId: string): Promise<UserEntity[]> {
    const list = await UserModel.findAll({ where: { enterpriseId } });
    return list.map(toEntity);
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    await UserModel.update(
      { refreshToken: token || null },
      { where: { id: userId } },
    );
  }

  async findByRefreshToken(token: string): Promise<UserEntity | null> {
    const m = await UserModel.findOne({ where: { refreshToken: token } });
    return m ? toEntity(m) : null;
  }
}
