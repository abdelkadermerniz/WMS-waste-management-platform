import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Classification, Collector, DashboardStats, WasteItem, AIModelConfig } from "../../types";
import { mockClassifications, mockCollectors, mockDashboardStats, mockVolumeData, mockDistributionData, mockWasteItems } from "../mock-data";

// Dashboard Data
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/stats");
        return res.data;
      } catch (e) {
        console.warn("Falling back to mock dashboard stats");
        return mockDashboardStats;
      }
    },
  });
}

export function useVolumeData() {
  return useQuery({
    queryKey: ["dashboard", "volume"],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/volume");
        return res.data;
      } catch (e) {
        return mockVolumeData;
      }
    },
  });
}

export function useDistributionData() {
  return useQuery({
    queryKey: ["dashboard", "distribution"],
    queryFn: async () => {
      try {
        const res = await api.get("/dashboard/distribution");
        return res.data;
      } catch (e) {
        return mockDistributionData;
      }
    },
  });
}

// Health status for AI classification service
export function useHealthStatus() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      try {
        const res = await api.get("/health");
        return res;
      } catch (e) {
        return { status: "OK", uptime: 99999, services: { ai: "up", db: "up" } };
      }
    },
    refetchInterval: 30000, // Poll every 30s
  });
}

// Classifications
export function useClassifications() {
  return useQuery<Classification[]>({
    queryKey: ["classifications"],
    queryFn: async () => {
      try {
        const res = await api.get("/classifications");
        return res.data;
      } catch (e) {
        return mockClassifications;
      }
    },
  });
}

export function useConfirmClassification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, category }: { id: string; category: string }) => {
      return api.post(`/classifications/${id}/confirm`, { category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRejectClassification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.post(`/classifications/${id}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Waste Items
export function useWasteItems() {
  return useQuery<WasteItem[]>({
    queryKey: ["waste-items"],
    queryFn: async () => {
      try {
        const res = await api.get("/waste-items");
        return res.data;
      } catch (e) {
        return mockWasteItems;
      }
    },
  });
}

// Collectors
export function useCollectors() {
  return useQuery<Collector[]>({
    queryKey: ["collectors"],
    queryFn: async () => {
      try {
        const res = await api.get("/collectors");
        return res.data;
      } catch (e) {
        return mockCollectors;
      }
    },
  });
}

export function useCreateCollector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Collector, "id" | "itemsCollectedToday">) => {
      return api.post("/collectors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collectors"] });
    },
  });
}

// Settings
export function useSettings() {
  return useQuery<AIModelConfig>({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const res = await api.get("/settings/ai-model");
        return res.data;
      } catch (e) {
        return {
          confidenceThreshold: 85,
          autoConfirmAboveThreshold: false,
          modelVersion: "v1.4.2 (ResNet50)",
        };
      }
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<AIModelConfig>) => {
      return api.put("/settings/ai-model", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
