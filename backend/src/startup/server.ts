import express, { Express, Request, Response } from "express";
import { successResponse } from "../utils/response.utils";
import { HttpStatusCode } from "../types";
import connectDB from "../config/db";
import { errorHandler, notFound } from "../middleware";
import { TradeRoute, UserRoutes, CapitalRoute, PerformaceRoute } from "../modules";
import cors from "cors";

function startServer(): Express {
  const app = express();

  // Middleware setup
  app.use(express.json());
  app.use(cors());

  app.use("/api/users", UserRoutes);
  app.use("/api/trades", TradeRoute);
  app.use("/api/startingcapital", CapitalRoute);
  app.use("/api/performace", PerformaceRoute);

  // Define routes and route handling
  app.get("/", (req: Request, res: Response) => {
    return successResponse(
      res,
      HttpStatusCode.OK,
      "Welcome to Accounting Booking Software Backend"
    );
  });

  connectDB();

  app.use(errorHandler);
  app.use(notFound);
  return app;
}

export default startServer;
