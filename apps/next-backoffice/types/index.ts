export type WasteCategory = "ORGANIC" | "PLASTIC" | "METAL" | "GLASS" | "HAZARDOUS" | "GENERAL";

export interface WasteItem {
  id: string;
  imageUrl: string;
  predictedCategory: WasteCategory;
  confidence: number;
  location: string;
  collectorId: string;
  timestamp: string;
}

export interface Classification {
  id: string;
  wasteItemId: string;
  imageUrl: string;
  predictedCategory: WasteCategory;
  confirmedCategory: WasteCategory | null;
  confidence: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  timestamp: string;
  notes?: string;
}

export interface Collector {
  id: string;
  name: string;
  zone: string;
  itemsCollectedToday: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface AIModelConfig {
  confidenceThreshold: number;
  autoConfirmAboveThreshold: boolean;
  modelVersion: string;
}

export interface DashboardStats {
  totalProcessedToday: number;
  accuracyPercentage: number;
  itemsPendingReview: number;
  co2SavedKg: number;
}
