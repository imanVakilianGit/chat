import { Router } from "express";

import { AuthController } from "./auth.controller";
import { guestGuard, renderGuestGuard } from "../guard/guest.guard";

export const AUTH_ROUTER: Router = Router();

AUTH_ROUTER.get("/signup", renderGuestGuard, AuthController.renderSignup);
AUTH_ROUTER.post(
    "/signup",
    guestGuard,
    AuthController.signup.bind(AuthController)
);

AUTH_ROUTER.get("/signin", renderGuestGuard, AuthController.renderSignin);
AUTH_ROUTER.post(
    "/signin",
    guestGuard,
    AuthController.signin.bind(AuthController)
);

AUTH_ROUTER.get(
    "/verify-otp",
    renderGuestGuard,
    AuthController.renderVerifyOtp
);
AUTH_ROUTER.post(
    "/verify-otp",
    guestGuard,
    AuthController.verifyOtp.bind(AuthController)
);
