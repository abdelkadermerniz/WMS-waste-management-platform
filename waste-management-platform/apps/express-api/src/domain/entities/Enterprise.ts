export interface EnterpriseEntity {
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

export type CreateEnterpriseDTO = Omit<
  EnterpriseEntity,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;
