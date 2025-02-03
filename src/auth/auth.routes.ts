import { Router } from "express";
import { AuthController } from "./auth.controller";

export const AUTH_ROUTER: Router = Router();

AUTH_ROUTER.get("/signup", AuthController.signup);
AUTH_ROUTER.post("/signup", AuthController.confirmSignup);
AUTH_ROUTER.get("/signin", AuthController.signin);
AUTH_ROUTER.post("/signin", AuthController.confirmSignin);
