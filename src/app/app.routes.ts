import { Router } from "express";
import { APP_CONTROLLER } from "./app.controller";

export const APP_ROUTER: Router = Router();

APP_ROUTER.get("/", APP_CONTROLLER.mainPage);
