import {
  CreateWasteCollectionDTO,
  WasteCollectionEntity,
} from "../../../domain/entities/WasteCollection";
import { IEnterpriseRepository } from "../../../domain/repositories/IEnterpriseRepository";
import { IWasteCollectionRepository } from "../../../domain/repositories/IWasteCollectionRepository";

export class CreateWasteCollectionUseCase {
  constructor(
    private readonly collectionRepo: IWasteCollectionRepository,
    private readonly enterpriseRepo: IEnterpriseRepository,
  ) {}

  async execute(dto: CreateWasteCollectionDTO): Promise<WasteCollectionEntity> {
    // Verify the enterprise exists and is active
    const enterprise = await this.enterpriseRepo.findById(dto.enterpriseId);
    if (!enterprise || !enterprise.isActive) {
      throw new Error(`Enterprise ${dto.enterpriseId} not found or inactive`);
    }

    if (dto.scheduledAt < new Date()) {
      throw new Error("Scheduled date must be in the future");
    }

    const collection = await this.collectionRepo.create(dto);
    return collection;
  }
}
