import { Router } from "express";
import UserController from "./user.controller";

const router = Router();

router.post("/create", UserController.createUserController);
router.post("/login", UserController.loginUserController);

export default router;
