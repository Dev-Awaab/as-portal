import { Router } from "express";
import TradeController from './trade.controller';

const router = Router();

router.post("/upload", TradeController.createTradeController);
router.get("/retrive", TradeController.getAll);

export default router;