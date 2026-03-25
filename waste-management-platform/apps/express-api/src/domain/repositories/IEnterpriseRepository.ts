import { CreateEnterpriseDTO, EnterpriseEntity } from "../entities/Enterprise";

export interface IEnterpriseRepository {
  findById(id: string): Promise<EnterpriseEntity | null>;
  findAll(filters?: {
    isActive?: boolean;
    city?: string;
  }): Promise<EnterpriseEntity[]>;
  create(data: CreateEnterpriseDTO): Promise<EnterpriseEntity>;
  update(
    id: string,
    data: Partial<EnterpriseEntity>,
  ): Promise<EnterpriseEntity | null>;
  delete(id: string): Promise<void>;
  findByRegistrationNumber(regNumber: string): Promise<EnterpriseEntity | null>;
}
