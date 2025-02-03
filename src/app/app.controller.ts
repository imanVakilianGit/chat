import { NextFunction, Request, Response } from "express";

import { AppService, AppServiceClass } from "./app.service";

export class AppControllerClass {
    private readonly _appService: AppServiceClass = AppService;

    mainPage(req: Request, res: Response, next: NextFunction): void {
        res.render("index");
        return;
    }
}

export const AppController = new AppControllerClass();
