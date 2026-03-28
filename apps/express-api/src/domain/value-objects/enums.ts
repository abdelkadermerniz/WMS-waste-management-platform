// ─────────────────────────────────────────────────────────
// SHARED VALUE OBJECTS
// ─────────────────────────────────────────────────────────

export type UserRole = "SUPER_ADMIN" | "ENTERPRISE_MANAGER" | "CHAUFFEUR";

export type ChauffeurStatus = "IDLE" | "EN_ROUTE" | "COMPLETED";

export type WasteType = "ORGANIC" | "RECYCLABLE" | "HAZARDOUS" | "GENERAL";

export type CollectionStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
