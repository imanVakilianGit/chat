import { Router } from "express";
import { GroupController } from "./group.controller";
import { authGuard, renderAuthGuard } from "../guard/auth.guard";
import { createGroupDto } from "./common/dto/create.dto";

export const GROUP_ROUTER = Router();

GROUP_ROUTER.get("/create", renderAuthGuard, GroupController.renderCreate);
GROUP_ROUTER.post(
    "/create",
    authGuard,
    createGroupDto,
    GroupController.create.bind(GroupController)
);
