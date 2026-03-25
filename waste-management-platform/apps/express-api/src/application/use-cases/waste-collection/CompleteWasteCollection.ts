import {
  UpdateCollectionStatusDTO,
  WasteCollectionEntity,
} from "../../../domain/entities/WasteCollection";
import { IChauffeurRepository } from "../../../domain/repositories/IChauffeurRepository";
import { IWasteCollectionRepository } from "../../../domain/repositories/IWasteCollectionRepository";

export class CompleteWasteCollectionUseCase {
  constructor(
    private readonly collectionRepo: IWasteCollectionRepository,
    private readonly chauffeurRepo: IChauffeurRepository,
  ) {}

  async execute(
    dto: UpdateCollectionStatusDTO,
  ): Promise<WasteCollectionEntity> {
    const collection = await this.collectionRepo.findById(dto.collectionId);
    if (!collection) {
      throw new Error(`Collection ${dto.collectionId} not found`);
    }

    if (collection.status !== "IN_PROGRESS") {
      throw new Error(
        `Cannot complete a collection with status: ${collection.status}`,
      );
    }

    if (dto.status !== "COMPLETED") {
      throw new Error("Use this use-case only to complete a collection");
    }

    const updated = await this.collectionRepo.updateStatus({
      collectionId: dto.collectionId,
      status: "COMPLETED",
      actualWeight: dto.actualWeight,
    });

    if (!updated) throw new Error("Failed to update collection status");

    // Mark chauffeur back to IDLE after completion
    if (collection.chauffeurId) {
      await this.chauffeurRepo.updateStatus(collection.chauffeurId, "IDLE");
    }

    return updated;
  }
}
