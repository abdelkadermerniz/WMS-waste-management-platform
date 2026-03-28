import { Classification, Collector, DashboardStats, WasteItem } from "../types";

export const mockDashboardStats: DashboardStats = {
  totalProcessedToday: 4280,
  accuracyPercentage: 94.2,
  itemsPendingReview: 142,
  co2SavedKg: 850.5
};

export const mockVolumeData = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  ORGANIC: Math.floor(Math.random() * 500) + 200,
  PLASTIC: Math.floor(Math.random() * 300) + 100,
  METAL: Math.floor(Math.random() * 150) + 50,
  GLASS: Math.floor(Math.random() * 100) + 30,
  HAZARDOUS: Math.floor(Math.random() * 20),
}));

export const mockDistributionData = [
  { name: "Organic", value: 45, fill: "#16a34a" },
  { name: "Plastic", value: 30, fill: "#3b82f6" },
  { name: "Metal", value: 15, fill: "#64748b" },
  { name: "Glass", value: 8, fill: "#0ea5e9" },
  { name: "Hazardous", value: 2, fill: "#dc2626" },
];

export const mockClassifications: Classification[] = Array.from({ length: 50 }).map((_, i) => {
  const categories = ["ORGANIC", "PLASTIC", "METAL", "GLASS", "HAZARDOUS"] as const;
  const statuses = ["PENDING", "CONFIRMED", "REJECTED"] as const;
  const randCat = categories[Math.floor(Math.random() * categories.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: `cls-${1000 + i}`,
    wasteItemId: `wi-${2000 + i}`,
    imageUrl: `https://images.unsplash.com/photo-1532996122724-e3c354a0b1bc?auto=format&fit=crop&w=300&q=80`,
    predictedCategory: randCat,
    confirmedCategory: status === "CONFIRMED" ? randCat : null,
    confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
    status,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  };
});

export const mockWasteItems: WasteItem[] = mockClassifications.map(c => ({
  id: c.wasteItemId,
  imageUrl: c.imageUrl,
  predictedCategory: c.predictedCategory,
  confidence: c.confidence,
  location: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 100)}`,
  collectorId: `col-${Math.floor(Math.random() * 10) + 1}`,
  timestamp: c.timestamp
}));

export const mockCollectors: Collector[] = [
  { id: "col-1", name: "Ahmed Y.", zone: "Zone A-North", itemsCollectedToday: 145, status: "ACTIVE" },
  { id: "col-2", name: "Sarah B.", zone: "Zone B-East", itemsCollectedToday: 89, status: "ACTIVE" },
  { id: "col-3", name: "Michael C.", zone: "Zone C-West", itemsCollectedToday: 210, status: "ACTIVE" },
  { id: "col-4", name: "Jessica L.", zone: "Zone D-South", itemsCollectedToday: 0, status: "INACTIVE" },
  { id: "col-5", name: "David K.", zone: "Zone A-South", itemsCollectedToday: 67, status: "ACTIVE" },
];
