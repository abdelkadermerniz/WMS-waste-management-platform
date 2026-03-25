import {
  CreateWasteCollectionDTO,
  UpdateCollectionStatusDTO,
  WasteCollectionEntity,
} from "../entities/WasteCollection";
import { CollectionStatus } from "../value-objects/enums";

export interface IWasteCollectionRepository {
  findById(id: string): Promise<WasteCollectionEntity | null>;
  findAllByEnterprise(
    enterpriseId: string,
    filters?: { status?: CollectionStatus },
  ): Promise<WasteCollectionEntity[]>;
  findAllByChauffeur(chauffeurId: string): Promise<WasteCollectionEntity[]>;
  findAll(filters?: {
    status?: CollectionStatus;
  }): Promise<WasteCollectionEntity[]>;
  create(data: CreateWasteCollectionDTO): Promise<WasteCollectionEntity>;
  updateStatus(
    data: UpdateCollectionStatusDTO,
  ): Promise<WasteCollectionEntity | null>;
  assignChauffeur(
    collectionId: string,
    chauffeurId: string,
  ): Promise<WasteCollectionEntity | null>;
}
