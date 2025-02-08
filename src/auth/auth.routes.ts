import { Router } from "express";

import { AuthController } from "./auth.controller";
import { guestGuard, renderGuestGuard } from "../guard/guest.guard";
import { signupDto } from "./common/dto/signup.dto";
import { signinDto } from "./common/dto/signin.dto";
import { verifyOtpDto } from "./common/dto/verify-otp.dto";

export const AUTH_ROUTER: Router = Router();

AUTH_ROUTER.get("/signup", renderGuestGuard, AuthController.renderSignup);
AUTH_ROUTER.post(
    "/signup",
    guestGuard,
    signupDto,
    AuthController.signup.bind(AuthController)
);

AUTH_ROUTER.get("/signin", renderGuestGuard, AuthController.renderSignin);
AUTH_ROUTER.post(
    "/signin",
    guestGuard,
    signinDto,
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
    verifyOtpDto,
    AuthController.verifyOtp.bind(AuthController)
);
