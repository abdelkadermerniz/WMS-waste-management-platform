import { DataTypes, Model, Optional } from "sequelize";
import { CollectionStatus, WasteType } from "../../domain/value-objects/enums";
import { sequelize } from "../database/sequelize";

interface WasteCollectionAttributes {
  id: string;
  enterpriseId: string;
  chauffeurId?: string;
  wasteType: WasteType;
  estimatedWeight: number;
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

type WasteCollectionCreationAttributes = Optional<
  WasteCollectionAttributes,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "chauffeurId"
  | "actualWeight"
  | "collectionLatitude"
  | "collectionLongitude"
  | "startedAt"
  | "completedAt"
  | "notes"
  | "reportUrl"
>;

export class WasteCollectionModel extends Model<
  WasteCollectionAttributes,
  WasteCollectionCreationAttributes
> {
  declare id: string;
  declare enterpriseId: string;
  declare chauffeurId?: string;
  declare wasteType: WasteType;
  declare estimatedWeight: number;
  declare actualWeight?: number;
  declare collectionAddress: string;
  declare collectionLatitude?: number;
  declare collectionLongitude?: number;
  declare status: CollectionStatus;
  declare scheduledAt: Date;
  declare startedAt?: Date;
  declare completedAt?: Date;
  declare notes?: string;
  declare reportUrl?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WasteCollectionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    enterpriseId: { type: DataTypes.UUID, allowNull: false },
    chauffeurId: { type: DataTypes.UUID, allowNull: true },
    wasteType: {
      type: DataTypes.ENUM("ORGANIC", "RECYCLABLE", "HAZARDOUS", "GENERAL"),
      allowNull: false,
    },
    estimatedWeight: { type: DataTypes.FLOAT, allowNull: false },
    actualWeight: { type: DataTypes.FLOAT, allowNull: true },
    collectionAddress: { type: DataTypes.STRING(500), allowNull: false },
    collectionLatitude: { type: DataTypes.FLOAT, allowNull: true },
    collectionLongitude: { type: DataTypes.FLOAT, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ),
      defaultValue: "PENDING",
    },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
    startedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    reportUrl: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "waste_collections", modelName: "WasteCollection" },
);
