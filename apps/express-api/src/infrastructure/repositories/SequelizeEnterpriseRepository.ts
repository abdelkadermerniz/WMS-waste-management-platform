import {
  CreateEnterpriseDTO,
  EnterpriseEntity,
} from "../../domain/entities/Enterprise";
import { IEnterpriseRepository } from "../../domain/repositories/IEnterpriseRepository";
import { EnterpriseModel } from "../models/EnterpriseModel";

const toEntity = (m: EnterpriseModel): EnterpriseEntity => ({
  id: m.id,
  name: m.name,
  registrationNumber: m.registrationNumber,
  address: m.address,
  city: m.city,
  country: m.country,
  latitude: m.latitude,
  longitude: m.longitude,
  contactEmail: m.contactEmail,
  contactPhone: m.contactPhone,
  isActive: m.isActive,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

export class SequelizeEnterpriseRepository implements IEnterpriseRepository {
  async findById(id: string): Promise<EnterpriseEntity | null> {
    const m = await EnterpriseModel.findByPk(id);
    return m ? toEntity(m) : null;
  }

  async findAll(filters?: {
    isActive?: boolean;
    city?: string;
  }): Promise<EnterpriseEntity[]> {
    const where: Record<string, unknown> = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.city) where.city = filters.city;
    const list = await EnterpriseModel.findAll({ where });
    return list.map(toEntity);
  }

  async create(data: CreateEnterpriseDTO): Promise<EnterpriseEntity> {
    const m = await EnterpriseModel.create(data as any);
    return toEntity(m);
  }

  async update(
    id: string,
    data: Partial<EnterpriseEntity>,
  ): Promise<EnterpriseEntity | null> {
    const m = await EnterpriseModel.findByPk(id);
    if (!m) return null;
    await m.update(data);
    return toEntity(m);
  }

  async delete(id: string): Promise<void> {
    await EnterpriseModel.destroy({ where: { id } });
  }

  async findByRegistrationNumber(
    regNumber: string,
  ): Promise<EnterpriseEntity | null> {
    const m = await EnterpriseModel.findOne({
      where: { registrationNumber: regNumber },
    });
    return m ? toEntity(m) : null;
  }
}
