import {
  CreateWasteCollectionDTO,
  UpdateCollectionStatusDTO,
  WasteCollectionEntity,
} from "../../domain/entities/WasteCollection";
import { IWasteCollectionRepository } from "../../domain/repositories/IWasteCollectionRepository";
import { CollectionStatus } from "../../domain/value-objects/enums";
import { WasteCollectionModel } from "../models/WasteCollectionModel";

const toEntity = (m: WasteCollectionModel): WasteCollectionEntity => ({
  id: m.id,
  enterpriseId: m.enterpriseId,
  chauffeurId: m.chauffeurId,
  wasteType: m.wasteType,
  estimatedWeight: m.estimatedWeight,
  actualWeight: m.actualWeight,
  collectionAddress: m.collectionAddress,
  collectionLatitude: m.collectionLatitude,
  collectionLongitude: m.collectionLongitude,
  status: m.status,
  scheduledAt: m.scheduledAt,
  startedAt: m.startedAt,
  completedAt: m.completedAt,
  notes: m.notes,
  reportUrl: m.reportUrl,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

export class SequelizeWasteCollectionRepository implements IWasteCollectionRepository {
  async findById(id: string): Promise<WasteCollectionEntity | null> {
    const m = await WasteCollectionModel.findByPk(id);
    return m ? toEntity(m) : null;
  }

  async findAllByEnterprise(
    enterpriseId: string,
    filters?: { status?: CollectionStatus },
  ): Promise<WasteCollectionEntity[]> {
    const where: Record<string, unknown> = { enterpriseId };
    if (filters?.status) where.status = filters.status;
    const list = await WasteCollectionModel.findAll({
      where,
      order: [["scheduledAt", "DESC"]],
    });
    return list.map(toEntity);
  }

  async findAllByChauffeur(
    chauffeurId: string,
  ): Promise<WasteCollectionEntity[]> {
    const list = await WasteCollectionModel.findAll({
      where: { chauffeurId },
      order: [["scheduledAt", "DESC"]],
    });
    return list.map(toEntity);
  }

  async findAll(filters?: {
    status?: CollectionStatus;
  }): Promise<WasteCollectionEntity[]> {
    const where: Record<string, unknown> = {};
    if (filters?.status) where.status = filters.status;
    const list = await WasteCollectionModel.findAll({
      where,
      order: [["scheduledAt", "DESC"]],
    });
    return list.map(toEntity);
  }

  async create(data: CreateWasteCollectionDTO): Promise<WasteCollectionEntity> {
    const m = await WasteCollectionModel.create(data as any);
    return toEntity(m);
  }

  async updateStatus(
    data: UpdateCollectionStatusDTO,
  ): Promise<WasteCollectionEntity | null> {
    const m = await WasteCollectionModel.findByPk(data.collectionId);
    if (!m) return null;

    const updates: Record<string, unknown> = { status: data.status };
    if (data.status === "IN_PROGRESS") updates.startedAt = new Date();
    if (data.status === "COMPLETED") {
      updates.completedAt = new Date();
      if (data.actualWeight !== undefined)
        updates.actualWeight = data.actualWeight;
    }

    await m.update(updates);
    return toEntity(m);
  }

  async assignChauffeur(
    collectionId: string,
    chauffeurId: string,
  ): Promise<WasteCollectionEntity | null> {
    const m = await WasteCollectionModel.findByPk(collectionId);
    if (!m) return null;
    await m.update({ chauffeurId, status: "ASSIGNED" });
    return toEntity(m);
  }
}
