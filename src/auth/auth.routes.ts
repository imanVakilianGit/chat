import { Router } from "express";
import { AUTH_CONTROLLER } from "./auth.controller";

export const AUTH_ROUTER: Router = Router();

AUTH_ROUTER.get("/signup", AUTH_CONTROLLER.signup);
AUTH_ROUTER.post("/signup", AUTH_CONTROLLER.confirmSignup);
AUTH_ROUTER.get("/signin", AUTH_CONTROLLER.signin);
AUTH_ROUTER.post("/signin", AUTH_CONTROLLER.confirmSignin);
