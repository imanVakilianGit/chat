import { Router } from "express";
import { UserController } from "./user.controller";
import { guestGuard, renderGuestGuard } from "../guard/guest.guard";
import { createUserDto } from "./common/dto/create.dto";

export const USER_ROUTER = Router();

USER_ROUTER.get(
    "/create-account",
    renderGuestGuard,
    UserController.renderCreate
);
USER_ROUTER.post(
    "/create-account",
    guestGuard,
    createUserDto,
    UserController.create.bind(UserController)
);
