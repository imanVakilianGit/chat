import { Router } from "express";

import { AppController } from "./app.controller";
import { AUTH_ROUTER } from "../auth/auth.routes";
import { USER_ROUTER } from "../user/user.routes";
import { renderAuthGuard } from "../guard/auth.guard";
import { GROUP_ROUTER } from "../group/group.routes";

export const APP_ROUTER: Router = Router();

APP_ROUTER.get("/", renderAuthGuard, AppController.mainPage);
APP_ROUTER.use("/auth", AUTH_ROUTER);
APP_ROUTER.use("/user", USER_ROUTER);
APP_ROUTER.use("/group", GROUP_ROUTER);
