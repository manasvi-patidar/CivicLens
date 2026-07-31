import dotenv from "dotenv";
import app from "./app";
import { logger } from "./shared/logger/logger";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 CivicLens API running at http://localhost:${PORT}`);
});
