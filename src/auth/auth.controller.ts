import { NextFunction, Request, Response } from "express";

import { AuthService, AuthServiceClass } from "./auth.service";

export class AuthControllerClass {
    private readonly _authService: AuthServiceClass = AuthService;

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

export const AuthController = new AuthControllerClass();
