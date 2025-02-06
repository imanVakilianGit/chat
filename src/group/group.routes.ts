import { Router } from "express";
import { GroupController } from "./group.controller";
import { authGuard, renderAuthGuard } from "../guard/auth.guard";

export const GROUP_ROUTER = Router();

GROUP_ROUTER.get("/create", renderAuthGuard, GroupController.renderCreate);
GROUP_ROUTER.post(
    "/create",
    authGuard,
    GroupController.create.bind(GroupController)
);
