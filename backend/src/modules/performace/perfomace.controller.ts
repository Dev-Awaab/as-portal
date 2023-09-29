import { NextFunction, Request, Response } from "express";
import { sendErrorResponse, sendJsonResponse } from "../../utils";
import { HttpStatusCode } from "../../types";
import { errorResponse } from "../../utils/response.utils";
import PerformaceService from "./performace.service";



class PerformaceController {
    static async createPerformaceController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            //console.log(req.body);
            const performace = await PerformaceService.createPerformaceFromUploadService(req.body);

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                performace
            );
        } catch (e: any) {
            next(e);
        }
    }

    static async getAllPerformace(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const performace = await PerformaceService.GetAllPerformace();

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                performace
            );
        } catch (e: any) {
            next(e);
        }
    }

}

export default PerformaceController;