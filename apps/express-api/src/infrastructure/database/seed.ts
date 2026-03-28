import bcrypt from "bcryptjs";
import "dotenv/config";
import { connectDatabase, sequelize } from "../database/sequelize";
import { ChauffeurModel, VehicleModel } from "../models/ChauffeurModel";
import { EnterpriseModel } from "../models/EnterpriseModel";
import { UserModel } from "../models/UserModel";
import { WasteCollectionModel } from "../models/WasteCollectionModel";

// Import model associations
import "./associations";

const seed = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("\n🌱 Starting database seed...\n");

    // ─── Sync all models ───────────────────────────────────
    await sequelize.sync({ force: true });
    console.log("✅ Tables created (force sync)");

    // ─── Seed: Super Admin ─────────────────────────────────
    const superAdminEmail =
      process.env.SUPER_ADMIN_EMAIL ?? "admin@wm-platform.com";
    const superAdminPassword =
      process.env.SUPER_ADMIN_PASSWORD ?? "Admin@1234!";
    const passwordHash = await bcrypt.hash(superAdminPassword, 12);

    const superAdmin = await UserModel.create({
      email: superAdminEmail,
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    });
    console.log(`✅ Super Admin created: ${superAdmin.email}`);

    // ─── Seed: Demo Enterprise ─────────────────────────────
    const enterprise = await EnterpriseModel.create({
      name: "EcoClean Solutions",
      registrationNumber: "FR-EC-2024-001",
      address: "12 Rue de la Paix",
      city: "Paris",
      country: "France",
      latitude: 48.8566,
      longitude: 2.3522,
      contactEmail: "contact@ecoclean.fr",
      contactPhone: "+33 1 23 45 67 89",
      isActive: true,
    });
    console.log(`✅ Demo Enterprise created: ${enterprise.name}`);

    // ─── Seed: Enterprise Manager ──────────────────────────
    const managerHash = await bcrypt.hash("Manager@1234!", 12);
    const manager = await UserModel.create({
      email: "manager@ecoclean.fr",
      passwordHash: managerHash,
      firstName: "Jean",
      lastName: "Dupont",
      role: "ENTERPRISE_MANAGER",
      enterpriseId: enterprise.id,
      isActive: true,
    });
    console.log(`✅ Enterprise Manager created: ${manager.email}`);

    // ─── Seed: Demo Vehicle ────────────────────────────────
    const vehicle = await VehicleModel.create({
      licensePlate: "AB-123-CD",
      model: "Mercedes Actros",
      capacity: 5000,
      isAvailable: true,
      enterpriseId: enterprise.id,
    });
    console.log(`✅ Demo Vehicle created: ${vehicle.licensePlate}`);

    // ─── Seed: Chauffeur user + profile ───────────────────
    const chauffeurHash = await bcrypt.hash("Chauffeur@1234!", 12);
    const chauffeurUser = await UserModel.create({
      email: "driver@ecoclean.fr",
      passwordHash: chauffeurHash,
      firstName: "Pierre",
      lastName: "Martin",
      role: "CHAUFFEUR",
      enterpriseId: enterprise.id,
      isActive: true,
    });
    const chauffeur = await ChauffeurModel.create({
      userId: chauffeurUser.id,
      enterpriseId: enterprise.id,
      vehicleId: vehicle.id,
      licenseNumber: "DL-2024-007",
      status: "IDLE",
    });
    console.log(`✅ Chauffeur created: ${chauffeurUser.email}`);

    // ─── Seed: Sample Collection Requests ─────────────────
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    await WasteCollectionModel.create({
      enterpriseId: enterprise.id,
      wasteType: "RECYCLABLE",
      estimatedWeight: 500,
      collectionAddress: "5 Avenue des Champs-Élysées, Paris",
      collectionLatitude: 48.8698,
      collectionLongitude: 2.3078,
      status: "PENDING",
      scheduledAt: futureDate,
      notes: "Please bring extra bags",
    });

    await WasteCollectionModel.create({
      enterpriseId: enterprise.id,
      chauffeurId: chauffeur.id,
      wasteType: "HAZARDOUS",
      estimatedWeight: 1200,
      collectionAddress: "10 Rue de Rivoli, Paris",
      status: "ASSIGNED",
      scheduledAt: new Date(futureDate.getTime() + 86400000),
    });

    console.log("✅ Sample waste collections created");

    console.log("\n🎉 Seeding complete!\n");
    console.log("────────────────────────────────────────────");
    console.log(`Super Admin:  ${superAdminEmail} / ${superAdminPassword}`);
    console.log("Manager:      manager@ecoclean.fr / Manager@1234!");
    console.log("Chauffeur:    driver@ecoclean.fr  / Chauffeur@1234!");
    console.log("────────────────────────────────────────────\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seed();
