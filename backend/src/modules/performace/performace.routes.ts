import { Router } from "express";
import PerformaceController from "./perfomace.controller";

const router = Router();

router.post("/", PerformaceController.createPerformaceController);
router.get("/", PerformaceController.getAllPerformace);

export default router;