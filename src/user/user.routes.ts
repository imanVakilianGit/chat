import { Router } from "express";
import { UserController } from "./user.controller";

export const USER_ROUTER = Router();

USER_ROUTER.get("/create-account", UserController.renderCreate);
USER_ROUTER.post("/create-account", UserController.create.bind(UserController));
