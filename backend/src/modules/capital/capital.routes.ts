import { Router } from "express";
import CapitalController from "./capital.controller";

const router = Router();

router.post("/", CapitalController.createCapitalController);
router.get("/", CapitalController.getAll);

export default router;