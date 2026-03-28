import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/sequelize";

interface EnterpriseAttributes {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type EnterpriseCreationAttributes = Optional<
  EnterpriseAttributes,
  "id" | "isActive" | "createdAt" | "updatedAt" | "latitude" | "longitude"
>;

export class EnterpriseModel extends Model<
  EnterpriseAttributes,
  EnterpriseCreationAttributes
> {
  declare id: string;
  declare name: string;
  declare registrationNumber: string;
  declare address: string;
  declare city: string;
  declare country: string;
  declare latitude?: number;
  declare longitude?: number;
  declare contactEmail: string;
  declare contactPhone: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EnterpriseModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(200), allowNull: false },
    registrationNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    address: { type: DataTypes.STRING(500), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    country: { type: DataTypes.STRING(100), allowNull: false },
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },
    contactEmail: { type: DataTypes.STRING(255), allowNull: false },
    contactPhone: { type: DataTypes.STRING(50), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "enterprises", modelName: "Enterprise" },
);
