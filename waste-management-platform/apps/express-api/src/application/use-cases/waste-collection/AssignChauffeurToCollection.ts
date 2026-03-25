import { WasteCollectionEntity } from "../../../domain/entities/WasteCollection";
import { IChauffeurRepository } from "../../../domain/repositories/IChauffeurRepository";
import { IWasteCollectionRepository } from "../../../domain/repositories/IWasteCollectionRepository";

export interface AssignChauffeurDTO {
  collectionId: string;
  chauffeurId: string;
  requesterId: string;
  requesterEnterpriseId?: string;
}

export class AssignChauffeurToCollectionUseCase {
  constructor(
    private readonly collectionRepo: IWasteCollectionRepository,
    private readonly chauffeurRepo: IChauffeurRepository,
  ) {}

  async execute(dto: AssignChauffeurDTO): Promise<WasteCollectionEntity> {
    // 1. Verify the collection exists
    const collection = await this.collectionRepo.findById(dto.collectionId);
    if (!collection) {
      throw new Error(`Collection ${dto.collectionId} not found`);
    }

    // 2. Validate the collection is assignable
    if (collection.status !== "PENDING") {
      throw new Error(
        `Cannot assign chauffeur to a collection with status: ${collection.status}`,
      );
    }

    // 3. Verify the chauffeur exists and is IDLE
    const chauffeur = await this.chauffeurRepo.findById(dto.chauffeurId);
    if (!chauffeur) {
      throw new Error(`Chauffeur ${dto.chauffeurId} not found`);
    }
    if (chauffeur.status !== "IDLE") {
      throw new Error(
        `Chauffeur is not available (current status: ${chauffeur.status})`,
      );
    }

    // 4. Assign and update collection status
    const updated = await this.collectionRepo.assignChauffeur(
      dto.collectionId,
      dto.chauffeurId,
    );
    if (!updated) {
      throw new Error("Failed to assign chauffeur to collection");
    }

    // 5. Update chauffeur status to EN_ROUTE
    await this.chauffeurRepo.updateStatus(dto.chauffeurId, "EN_ROUTE");

    return updated;
  }
}
