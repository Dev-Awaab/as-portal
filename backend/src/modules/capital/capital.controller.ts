import { NextFunction, Request, Response } from "express";
import { sendErrorResponse, sendJsonResponse } from "../../utils";
import { HttpStatusCode } from "../../types";
import { errorResponse } from "../../utils/response.utils";
import CapitalService from "./capital.service";



class CapitalController {
    static async createCapitalController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            //console.log(req.body);
            const capital = await CapitalService.createNewInitialCapital(req.body);

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                capital
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
            const capital = await CapitalService.GetAllCapital();

            sendJsonResponse(
                res,
                HttpStatusCode.CREATED,
                "Trades Successfully Recorded",
                capital
            );
        } catch (e: any) {
            next(e);
        }
    }

}

export default CapitalController;