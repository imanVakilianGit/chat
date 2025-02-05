import { NextFunction, Request, Response } from "express";

import { AuthService, AuthServiceClass } from "./auth.service";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { response } from "../common/function/response.func";
import { CREATE_ACCOUNT_PERMISSION_COOKIE_OPTION } from "../cookie/option/create-account-permission.option";
import { OTP_CODE_VERIFICATION_COOKIE_OPTION } from "../cookie/option/otp-code-verification.option";
import { ACCESS_TOKEN_COOKIE_OPTION } from "../cookie/option/access-token.option";
import { REFRESH_TOKEN_COOKIE_OPTION } from "../cookie/option/refresh-token.option";

export class AuthControllerClass {
    private readonly _authService: AuthServiceClass = AuthService;

    renderSignup(req: Request, res: Response, next: NextFunction): void {
        res.render("sign-up");
        return;
    }
    renderSignin(req: Request, res: Response, next: NextFunction): void {
        res.render("sign-in");
        return;
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            console.dir(
                { "auth.controller.ts:24:body": body },
                { depth: null, colors: true }
            );

            await this._authService.signup(body);

            res.cookie(
                "create-account-permission",
                { email: body.email },
                CREATE_ACCOUNT_PERMISSION_COOKIE_OPTION
            );

            res.cookie(
                "otp-code-verification",
                { email: body.email, isNewUser: true },
                OTP_CODE_VERIFICATION_COOKIE_OPTION
            );
            res.json(response({ redirect: "/auth/verify-otp" }));
        } catch (error) {
            next(error);
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            console.dir(
                { "auth.controller.ts:57:body": body },
                { depth: null, colors: true }
            );

            await this._authService.signin(body);

            res.cookie(
                "otp-code-verification",
                { email: body.email, isNewUser: false },
                OTP_CODE_VERIFICATION_COOKIE_OPTION
            );
            res.json(response({ redirect: "/auth/verify-otp" }));
        } catch (error) {
            next(error);
        }
    }

    async renderVerifyOtp(req: Request, res: Response, next: NextFunction) {
        const cookie = req.signedCookies["otp-code-verification"];
        if (!cookie) {
            res.redirect("/auth/signin");
            return;
        }
        res.render("otp");
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const cookie = req.signedCookies["otp-code-verification"];
            if (!cookie)
                throw exceptionHandler({
                    statusCode: 400,
                    message: "otp expired",
                });

            const result = await this._authService.verifyOtp({
                email: cookie.email,
                isNewUser: cookie.isNewUser,
                code: req.body.code,
            });

            if (cookie.isNewUser) {
                res.json({ ok: true, redirect: "/user/create-account" });
            }

            res.cookie(
                "access-token",
                result?.accessToken,
                ACCESS_TOKEN_COOKIE_OPTION
            );

            res.cookie(
                "refresh-token",
                result?.refreshToken,
                REFRESH_TOKEN_COOKIE_OPTION
            );

            res.clearCookie("otp-code-verification");

            res.json(response({ redirect: "/" }));
        } catch (error) {
            next(error);
        }
    }
}

export const AuthController = new AuthControllerClass();
