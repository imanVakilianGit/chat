import { NextFunction, Request, Response } from "express";
import { APP_SERVICE, AppService } from "./app.service";

export class AppController {
    private readonly _appService: AppService = APP_SERVICE;

    mainPage(req: Request, res: Response, next: NextFunction): void {
        res.render("index");
        return;
    }
}

export const APP_CONTROLLER = new AppController();
