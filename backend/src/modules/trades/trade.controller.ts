import { NextFunction, Request, Response } from "express";
import { sendErrorResponse, sendJsonResponse } from "../../utils";
import { HttpStatusCode } from "../../types";
import { errorResponse } from "../../utils/response.utils";
import TradeService from "./trade.service";


class TradeController {
    static async createTradeController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            //console.log(req.body);
            const trade = await TradeService.createTradeFromUploadService(req.body);

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                trade
            );
        } catch (e: any) {
            next(e);
        }
    }

    static async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const trade = await TradeService.RetriveAllTrades();

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                trade
            );
        } catch (e: any) {
            next(e);
        }
    }

}

export default TradeController;
