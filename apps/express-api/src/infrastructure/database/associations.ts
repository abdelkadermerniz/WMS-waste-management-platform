import { ChauffeurModel, VehicleModel } from "../models/ChauffeurModel";
import { EnterpriseModel } from "../models/EnterpriseModel";
import { UserModel } from "../models/UserModel";
import { WasteCollectionModel } from "../models/WasteCollectionModel";

// ─── Enterprise has many Users ─────────────────────────────
EnterpriseModel.hasMany(UserModel, { foreignKey: "enterpriseId", as: "users" });
UserModel.belongsTo(EnterpriseModel, {
  foreignKey: "enterpriseId",
  as: "enterprise",
});

// ─── Enterprise has many Vehicles ──────────────────────────
EnterpriseModel.hasMany(VehicleModel, {
  foreignKey: "enterpriseId",
  as: "vehicles",
});
VehicleModel.belongsTo(EnterpriseModel, {
  foreignKey: "enterpriseId",
  as: "enterprise",
});

// ─── Enterprise has many Chauffeurs ────────────────────────
EnterpriseModel.hasMany(ChauffeurModel, {
  foreignKey: "enterpriseId",
  as: "chauffeurs",
});
ChauffeurModel.belongsTo(EnterpriseModel, {
  foreignKey: "enterpriseId",
  as: "enterprise",
});

// ─── Chauffeur belongs to a User ──────────────────────────
UserModel.hasOne(ChauffeurModel, {
  foreignKey: "userId",
  as: "chauffeurProfile",
});
ChauffeurModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

// ─── Chauffeur belongs to a Vehicle ───────────────────────
VehicleModel.hasMany(ChauffeurModel, {
  foreignKey: "vehicleId",
  as: "chauffeurs",
});
ChauffeurModel.belongsTo(VehicleModel, {
  foreignKey: "vehicleId",
  as: "vehicle",
});

// ─── Enterprise has many WasteCollections ─────────────────
EnterpriseModel.hasMany(WasteCollectionModel, {
  foreignKey: "enterpriseId",
  as: "collections",
});
WasteCollectionModel.belongsTo(EnterpriseModel, {
  foreignKey: "enterpriseId",
  as: "enterprise",
});

// ─── Chauffeur has many WasteCollections ──────────────────
ChauffeurModel.hasMany(WasteCollectionModel, {
  foreignKey: "chauffeurId",
  as: "collections",
});
WasteCollectionModel.belongsTo(ChauffeurModel, {
  foreignKey: "chauffeurId",
  as: "chauffeur",
});

export {};
