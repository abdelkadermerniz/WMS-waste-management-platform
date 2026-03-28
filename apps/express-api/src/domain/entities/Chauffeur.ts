import { ChauffeurStatus } from "../value-objects/enums";

export interface VehicleEntity {
  id: string;
  licensePlate: string;
  model: string;
  capacity: number; // in kg
  isAvailable: boolean;
  enterpriseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChauffeurEntity {
  id: string;
  userId: string;
  enterpriseId: string;
  vehicleId?: string;
  licenseNumber: string;
  status: ChauffeurStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateChauffeurDTO = Omit<
  ChauffeurEntity,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type CreateVehicleDTO = Omit<
  VehicleEntity,
  "id" | "isAvailable" | "createdAt" | "updatedAt"
>;
