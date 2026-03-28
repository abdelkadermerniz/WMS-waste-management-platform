import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssignChauffeurToCollectionUseCase } from "../../../src/application/use-cases/waste-collection/AssignChauffeurToCollection";
import { CompleteWasteCollectionUseCase } from "../../../src/application/use-cases/waste-collection/CompleteWasteCollection";
import { CreateWasteCollectionUseCase } from "../../../src/application/use-cases/waste-collection/CreateWasteCollection";
import { ChauffeurEntity } from "../../../src/domain/entities/Chauffeur";
import { EnterpriseEntity } from "../../../src/domain/entities/Enterprise";
import { WasteCollectionEntity } from "../../../src/domain/entities/WasteCollection";
import { IChauffeurRepository } from "../../../src/domain/repositories/IChauffeurRepository";
import { IEnterpriseRepository } from "../../../src/domain/repositories/IEnterpriseRepository";
import { IWasteCollectionRepository } from "../../../src/domain/repositories/IWasteCollectionRepository";

// ─────────────────────────────────────────────────────────────
// MOCK REPOSITORIES
// ─────────────────────────────────────────────────────────────
const mockCollectionRepo: IWasteCollectionRepository = {
  findById: vi.fn(),
  findAllByEnterprise: vi.fn(),
  findAllByChauffeur: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  updateStatus: vi.fn(),
  assignChauffeur: vi.fn(),
};

const mockChauffeurRepo: IChauffeurRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findAllByEnterprise: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  updateLocation: vi.fn(),
  findAvailable: vi.fn(),
};

const mockEnterpriseRepo: IEnterpriseRepository = {
  findById: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByRegistrationNumber: vi.fn(),
};

// ─────────────────────────────────────────────────────────────
// FIXTURES
// ─────────────────────────────────────────────────────────────
const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days

const makeCollection = (
  overrides: Partial<WasteCollectionEntity> = {},
): WasteCollectionEntity => ({
  id: "col-uuid-1",
  enterpriseId: "ent-uuid-1",
  wasteType: "RECYCLABLE",
  estimatedWeight: 500,
  collectionAddress: "12 Rue de Paris",
  status: "PENDING",
  scheduledAt: futureDate,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeChauffeur = (
  overrides: Partial<ChauffeurEntity> = {},
): ChauffeurEntity => ({
  id: "chauf-uuid-1",
  userId: "user-uuid-1",
  enterpriseId: "ent-uuid-1",
  licenseNumber: "DL-2024-001",
  status: "IDLE",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeEnterprise = (
  overrides: Partial<EnterpriseEntity> = {},
): EnterpriseEntity => ({
  id: "ent-uuid-1",
  name: "EcoClean",
  registrationNumber: "FR-001",
  address: "1 Rue Test",
  city: "Paris",
  country: "France",
  contactEmail: "test@ecoclean.fr",
  contactPhone: "+33123456789",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// ─────────────────────────────────────────────────────────────
// TESTS: AssignChauffeurToCollectionUseCase
// ─────────────────────────────────────────────────────────────
describe("AssignChauffeurToCollectionUseCase", () => {
  let useCase: AssignChauffeurToCollectionUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new AssignChauffeurToCollectionUseCase(
      mockCollectionRepo,
      mockChauffeurRepo,
    );
  });

  it("should successfully assign an IDLE chauffeur to a PENDING collection", async () => {
    const assigned = makeCollection({
      status: "ASSIGNED",
      chauffeurId: "chauf-uuid-1",
    });
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(makeCollection());
    vi.mocked(mockChauffeurRepo.findById).mockResolvedValue(makeChauffeur());
    vi.mocked(mockCollectionRepo.assignChauffeur).mockResolvedValue(assigned);
    vi.mocked(mockChauffeurRepo.updateStatus).mockResolvedValue(undefined);

    const result = await useCase.execute({
      collectionId: "col-uuid-1",
      chauffeurId: "chauf-uuid-1",
      requesterId: "user-uuid-1",
    });

    expect(result.status).toBe("ASSIGNED");
    expect(result.chauffeurId).toBe("chauf-uuid-1");
    expect(mockChauffeurRepo.updateStatus).toHaveBeenCalledWith(
      "chauf-uuid-1",
      "EN_ROUTE",
    );
  });

  it("should throw if the collection does not exist", async () => {
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        collectionId: "invalid-id",
        chauffeurId: "chauf-uuid-1",
        requesterId: "user-1",
      }),
    ).rejects.toThrow("not found");
  });

  it("should throw if the collection is already assigned", async () => {
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(
      makeCollection({ status: "ASSIGNED" }),
    );

    await expect(
      useCase.execute({
        collectionId: "col-uuid-1",
        chauffeurId: "chauf-uuid-1",
        requesterId: "user-1",
      }),
    ).rejects.toThrow("Cannot assign chauffeur");
  });

  it("should throw if the chauffeur is not IDLE", async () => {
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(makeCollection());
    vi.mocked(mockChauffeurRepo.findById).mockResolvedValue(
      makeChauffeur({ status: "EN_ROUTE" }),
    );

    await expect(
      useCase.execute({
        collectionId: "col-uuid-1",
        chauffeurId: "chauf-uuid-1",
        requesterId: "user-1",
      }),
    ).rejects.toThrow("not available");
  });

  it("should throw if the chauffeur does not exist", async () => {
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(makeCollection());
    vi.mocked(mockChauffeurRepo.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        collectionId: "col-uuid-1",
        chauffeurId: "ghost-id",
        requesterId: "user-1",
      }),
    ).rejects.toThrow("not found");
  });
});

// ─────────────────────────────────────────────────────────────
// TESTS: CreateWasteCollectionUseCase
// ─────────────────────────────────────────────────────────────
describe("CreateWasteCollectionUseCase", () => {
  let useCase: CreateWasteCollectionUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CreateWasteCollectionUseCase(
      mockCollectionRepo,
      mockEnterpriseRepo,
    );
  });

  it("should create a new collection for a valid enterprise", async () => {
    vi.mocked(mockEnterpriseRepo.findById).mockResolvedValue(makeEnterprise());
    vi.mocked(mockCollectionRepo.create).mockResolvedValue(makeCollection());

    const result = await useCase.execute({
      enterpriseId: "ent-uuid-1",
      wasteType: "RECYCLABLE",
      estimatedWeight: 500,
      collectionAddress: "12 Rue de Paris",
      scheduledAt: futureDate,
    });

    expect(result.id).toBe("col-uuid-1");
    expect(result.status).toBe("PENDING");
    expect(mockCollectionRepo.create).toHaveBeenCalledOnce();
  });

  it("should throw if enterprise not found or inactive", async () => {
    vi.mocked(mockEnterpriseRepo.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        enterpriseId: "ghost-id",
        wasteType: "ORGANIC",
        estimatedWeight: 100,
        collectionAddress: "Some Addr",
        scheduledAt: futureDate,
      }),
    ).rejects.toThrow("not found or inactive");
  });

  it("should throw if scheduled date is in the past", async () => {
    vi.mocked(mockEnterpriseRepo.findById).mockResolvedValue(makeEnterprise());
    const pastDate = new Date(Date.now() - 1000);

    await expect(
      useCase.execute({
        enterpriseId: "ent-uuid-1",
        wasteType: "GENERAL",
        estimatedWeight: 200,
        collectionAddress: "1 Rue Passé",
        scheduledAt: pastDate,
      }),
    ).rejects.toThrow("future");
  });
});

// ─────────────────────────────────────────────────────────────
// TESTS: CompleteWasteCollectionUseCase
// ─────────────────────────────────────────────────────────────
describe("CompleteWasteCollectionUseCase", () => {
  let useCase: CompleteWasteCollectionUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CompleteWasteCollectionUseCase(
      mockCollectionRepo,
      mockChauffeurRepo,
    );
  });

  it("should complete an IN_PROGRESS collection and free the chauffeur", async () => {
    const inProgress = makeCollection({
      status: "IN_PROGRESS",
      chauffeurId: "chauf-uuid-1",
    });
    const completed = makeCollection({
      status: "COMPLETED",
      actualWeight: 480,
    });
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(inProgress);
    vi.mocked(mockCollectionRepo.updateStatus).mockResolvedValue(completed);
    vi.mocked(mockChauffeurRepo.updateStatus).mockResolvedValue(undefined);

    const result = await useCase.execute({
      collectionId: "col-uuid-1",
      status: "COMPLETED",
      actualWeight: 480,
    });

    expect(result.status).toBe("COMPLETED");
    expect(mockChauffeurRepo.updateStatus).toHaveBeenCalledWith(
      "chauf-uuid-1",
      "IDLE",
    );
  });

  it("should throw if collection is not IN_PROGRESS", async () => {
    vi.mocked(mockCollectionRepo.findById).mockResolvedValue(
      makeCollection({ status: "PENDING" }),
    );

    await expect(
      useCase.execute({ collectionId: "col-uuid-1", status: "COMPLETED" }),
    ).rejects.toThrow("Cannot complete");
  });
});
