import {
  ChauffeurEntity,
  CreateChauffeurDTO,
  CreateVehicleDTO,
  VehicleEntity,
} from "../entities/Chauffeur";
import { ChauffeurStatus } from "../value-objects/enums";

export interface IChauffeurRepository {
  findById(id: string): Promise<ChauffeurEntity | null>;
  findByUserId(userId: string): Promise<ChauffeurEntity | null>;
  findAllByEnterprise(enterpriseId: string): Promise<ChauffeurEntity[]>;
  create(data: CreateChauffeurDTO): Promise<ChauffeurEntity>;
  update(
    id: string,
    data: Partial<ChauffeurEntity>,
  ): Promise<ChauffeurEntity | null>;
  updateStatus(id: string, status: ChauffeurStatus): Promise<void>;
  updateLocation(id: string, lat: number, lng: number): Promise<void>;
  findAvailable(enterpriseId: string): Promise<ChauffeurEntity[]>;
}

export interface IVehicleRepository {
  findById(id: string): Promise<VehicleEntity | null>;
  findAllByEnterprise(enterpriseId: string): Promise<VehicleEntity[]>;
  create(data: CreateVehicleDTO): Promise<VehicleEntity>;
  update(
    id: string,
    data: Partial<VehicleEntity>,
  ): Promise<VehicleEntity | null>;
  findAvailable(enterpriseId: string): Promise<VehicleEntity[]>;
}
