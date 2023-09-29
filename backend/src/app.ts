import dotenv from "dotenv";
import express from "express";
import { logger } from "./utils";
import { startServer } from "./startup";

// Env init
dotenv.config();

const PORT: number = Number(process.env.PORT) || 7001;

const server = express();
const app = startServer();

server.use(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
