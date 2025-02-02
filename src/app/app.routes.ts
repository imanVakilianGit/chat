import { Router } from "express";

import { APP_CONTROLLER } from "./app.controller";
import { AUTH_ROUTER } from "../auth/auth.routes";

export const APP_ROUTER: Router = Router();

APP_ROUTER.get("/", APP_CONTROLLER.mainPage);
APP_ROUTER.use("/auth", AUTH_ROUTER);
