import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import { sendErrorResponse, sendJsonResponse } from "../../utils";
import { HttpStatusCode } from "../../types";
import { errorResponse } from "../../utils/response.utils";

class UserController {
  static async createUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.createUserService(req.body);

      sendJsonResponse(
        res,
        HttpStatusCode.CREATED,
        "Account Created Successfully!",
        user
      );
    } catch (e: any) {
      next(e);
    }
  }

  static async loginUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.loginUserService(req.body);

     

      sendJsonResponse(res, HttpStatusCode.OK, "Logged In Successful", user);
    } catch (e: any) {
      next(e);
    }
  }
}

export default UserController;
