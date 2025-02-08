import { NextFunction, Request, Response } from "express";

import { AuthService, AuthServiceClass } from "./auth.service";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { response } from "../common/function/response.func";
import { CREATE_ACCOUNT_PERMISSION_COOKIE_OPTION } from "../cookie/option/create-account-permission.option";
import { OTP_CODE_VERIFICATION_COOKIE_OPTION } from "../cookie/option/otp-code-verification.option";
import { ACCESS_TOKEN_COOKIE_OPTION } from "../cookie/option/access-token.option";
import { REFRESH_TOKEN_COOKIE_OPTION } from "../cookie/option/refresh-token.option";
import { SignupDtoInterface } from "./common/interface/dto/signup.interface";
import { SigninDtoInterface } from "./common/interface/dto/signin.interface";
import { VerifyOtpDtoInterface } from "./common/interface/dto/verify-otp.interface";

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

    async signup(
        req: Request<any, any, SignupDtoInterface>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dto: SignupDtoInterface = req.body;

            await this._authService.signup(dto);

            res.cookie(
                "create-account-permission",
                { email: dto.email },
                CREATE_ACCOUNT_PERMISSION_COOKIE_OPTION
            );

            res.cookie(
                "otp-code-verification",
                { email: dto.email, isNewUser: true },
                OTP_CODE_VERIFICATION_COOKIE_OPTION
            );
            res.json(response({ redirect: "/auth/verify-otp" }));
        } catch (error) {
            next(error);
        }
    }

    async signin(
        req: Request<any, any, SigninDtoInterface>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dto: SigninDtoInterface = req.body;

            await this._authService.signin(dto);

            res.cookie(
                "otp-code-verification",
                { email: dto.email, isNewUser: false },
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

    async verifyOtp(
        req: Request<any, any, VerifyOtpDtoInterface>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dto: VerifyOtpDtoInterface = req.body;

            const cookie = req.signedCookies["otp-code-verification"];
            if (!cookie)
                throw exceptionHandler({
                    statusCode: 400,
                    message: "otp expired",
                });

            const result = await this._authService.verifyOtp({
                email: cookie.email,
                isNewUser: cookie.isNewUser,
                code: dto.code,
            });

            if (cookie.isNewUser) {
                res.json({ ok: true, redirect: "/user/create-account" });
                return;
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
