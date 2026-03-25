import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./infrastructure/database/sequelize";

const PORT = Number(process.env.PORT ?? 3001);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs:  http://localhost:${PORT}/api/docs`);
      console.log(`💓 Health:    http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
