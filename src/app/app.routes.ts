import { Router } from "express";

import { AppController } from "./app.controller";
import { AUTH_ROUTER } from "../auth/auth.routes";

export const APP_ROUTER: Router = Router();

APP_ROUTER.get("/", AppController.mainPage);
APP_ROUTER.use("/auth", AUTH_ROUTER);
