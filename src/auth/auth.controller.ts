import { NextFunction, Request, Response } from "express";
import { AUTH_SERVICE, AuthService } from "./auth.service";

export class AuthController {
    private readonly _authService: AuthService = AUTH_SERVICE;

    signup(req: Request, res: Response, next: NextFunction): void {
        res.render("sign-up");
        return;
    }
    signin(req: Request, res: Response, next: NextFunction): void {
        res.render("sign-in");
        return;
    }

    confirmSignup(req: Request, res: Response, next: NextFunction): void {
        return;
    }

    confirmSignin(req: Request, res: Response, next: NextFunction): void {
        return;
    }
}

export const AUTH_CONTROLLER = new AuthController();
