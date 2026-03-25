import { DataTypes, Model, Optional } from "sequelize";
import { ChauffeurStatus } from "../../domain/value-objects/enums";
import { sequelize } from "../database/sequelize";

// ─── Vehicle ───────────────────────────────────────────────

interface VehicleAttributes {
  id: string;
  licensePlate: string;
  model: string;
  capacity: number;
  isAvailable: boolean;
  enterpriseId: string;
  createdAt: Date;
  updatedAt: Date;
}

type VehicleCreationAttributes = Optional<
  VehicleAttributes,
  "id" | "isAvailable" | "createdAt" | "updatedAt"
>;

export class VehicleModel extends Model<
  VehicleAttributes,
  VehicleCreationAttributes
> {
  declare id: string;
  declare licensePlate: string;
  declare model: string;
  declare capacity: number;
  declare isAvailable: boolean;
  declare enterpriseId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

VehicleModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    model: { type: DataTypes.STRING(100), allowNull: false },
    capacity: { type: DataTypes.FLOAT, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    enterpriseId: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "vehicles", modelName: "Vehicle" },
);

// ─── Chauffeur ─────────────────────────────────────────────

interface ChauffeurAttributes {
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

type ChauffeurCreationAttributes = Optional<
  ChauffeurAttributes,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "vehicleId"
  | "currentLatitude"
  | "currentLongitude"
>;

export class ChauffeurModel extends Model<
  ChauffeurAttributes,
  ChauffeurCreationAttributes
> {
  declare id: string;
  declare userId: string;
  declare enterpriseId: string;
  declare vehicleId?: string;
  declare licenseNumber: string;
  declare status: ChauffeurStatus;
  declare currentLatitude?: number;
  declare currentLongitude?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ChauffeurModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    enterpriseId: { type: DataTypes.UUID, allowNull: false },
    vehicleId: { type: DataTypes.UUID, allowNull: true },
    licenseNumber: { type: DataTypes.STRING(50), allowNull: false },
    status: {
      type: DataTypes.ENUM("IDLE", "EN_ROUTE", "COMPLETED"),
      defaultValue: "IDLE",
    },
    currentLatitude: { type: DataTypes.FLOAT, allowNull: true },
    currentLongitude: { type: DataTypes.FLOAT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "chauffeurs", modelName: "Chauffeur" },
);
