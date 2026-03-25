import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  database: process.env.DB_NAME ?? "waste_management_db",
  username: process.env.DB_USER ?? "wm_user",
  password: process.env.DB_PASSWORD ?? "wm_password",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Database models synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    throw error;
  }
};
