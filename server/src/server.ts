import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { logger } from "./shared/logger/logger";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  logger.info(`CivicLens API running at http://localhost:${PORT}`);
});
