import {
  ChauffeurEntity,
  CreateChauffeurDTO,
  CreateVehicleDTO,
  VehicleEntity,
} from "../../domain/entities/Chauffeur";
import {
  IChauffeurRepository,
  IVehicleRepository,
} from "../../domain/repositories/IChauffeurRepository";
import { ChauffeurStatus } from "../../domain/value-objects/enums";
import { ChauffeurModel, VehicleModel } from "../models/ChauffeurModel";

const chauffeurToEntity = (m: ChauffeurModel): ChauffeurEntity => ({
  id: m.id,
  userId: m.userId,
  enterpriseId: m.enterpriseId,
  vehicleId: m.vehicleId,
  licenseNumber: m.licenseNumber,
  status: m.status,
  currentLatitude: m.currentLatitude,
  currentLongitude: m.currentLongitude,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

const vehicleToEntity = (m: VehicleModel): VehicleEntity => ({
  id: m.id,
  licensePlate: m.licensePlate,
  model: m.model,
  capacity: m.capacity,
  isAvailable: m.isAvailable,
  enterpriseId: m.enterpriseId,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

export class SequelizeChauffeurRepository implements IChauffeurRepository {
  async findById(id: string): Promise<ChauffeurEntity | null> {
    const m = await ChauffeurModel.findByPk(id);
    return m ? chauffeurToEntity(m) : null;
  }

  async findByUserId(userId: string): Promise<ChauffeurEntity | null> {
    const m = await ChauffeurModel.findOne({ where: { userId } });
    return m ? chauffeurToEntity(m) : null;
  }

  async findAllByEnterprise(enterpriseId: string): Promise<ChauffeurEntity[]> {
    const list = await ChauffeurModel.findAll({ where: { enterpriseId } });
    return list.map(chauffeurToEntity);
  }

  async create(data: CreateChauffeurDTO): Promise<ChauffeurEntity> {
    const m = await ChauffeurModel.create(data as any);
    return chauffeurToEntity(m);
  }

  async update(
    id: string,
    data: Partial<ChauffeurEntity>,
  ): Promise<ChauffeurEntity | null> {
    const m = await ChauffeurModel.findByPk(id);
    if (!m) return null;
    await m.update(data);
    return chauffeurToEntity(m);
  }

  async updateStatus(id: string, status: ChauffeurStatus): Promise<void> {
    await ChauffeurModel.update({ status }, { where: { id } });
  }

  async updateLocation(id: string, lat: number, lng: number): Promise<void> {
    await ChauffeurModel.update(
      { currentLatitude: lat, currentLongitude: lng },
      { where: { id } },
    );
  }

  async findAvailable(enterpriseId: string): Promise<ChauffeurEntity[]> {
    const list = await ChauffeurModel.findAll({
      where: { enterpriseId, status: "IDLE" },
    });
    return list.map(chauffeurToEntity);
  }
}

export class SequelizeVehicleRepository implements IVehicleRepository {
  async findById(id: string): Promise<VehicleEntity | null> {
    const m = await VehicleModel.findByPk(id);
    return m ? vehicleToEntity(m) : null;
  }

  async findAllByEnterprise(enterpriseId: string): Promise<VehicleEntity[]> {
    const list = await VehicleModel.findAll({ where: { enterpriseId } });
    return list.map(vehicleToEntity);
  }

  async create(data: CreateVehicleDTO): Promise<VehicleEntity> {
    const m = await VehicleModel.create(data as any);
    return vehicleToEntity(m);
  }

  async update(
    id: string,
    data: Partial<VehicleEntity>,
  ): Promise<VehicleEntity | null> {
    const m = await VehicleModel.findByPk(id);
    if (!m) return null;
    await m.update(data);
    return vehicleToEntity(m);
  }

  async findAvailable(enterpriseId: string): Promise<VehicleEntity[]> {
    const list = await VehicleModel.findAll({
      where: { enterpriseId, isAvailable: true },
    });
    return list.map(vehicleToEntity);
  }
}
