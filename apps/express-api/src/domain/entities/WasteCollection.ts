import { CollectionStatus, WasteType } from "../value-objects/enums";

export interface WasteCollectionEntity {
  id: string;
  enterpriseId: string;
  chauffeurId?: string;
  wasteType: WasteType;
  estimatedWeight: number; // in kg
  actualWeight?: number;
  collectionAddress: string;
  collectionLatitude?: number;
  collectionLongitude?: number;
  status: CollectionStatus;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  reportUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateWasteCollectionDTO = Pick<
  WasteCollectionEntity,
  | "enterpriseId"
  | "wasteType"
  | "estimatedWeight"
  | "collectionAddress"
  | "collectionLatitude"
  | "collectionLongitude"
  | "scheduledAt"
  | "notes"
>;

export type UpdateCollectionStatusDTO = {
  collectionId: string;
  status: CollectionStatus;
  actualWeight?: number;
};
