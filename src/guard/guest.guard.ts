import { NextFunction, Request, Response } from "express";
import { response } from "../common/function/response.func";

export function renderGuestGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.signedCookies["access-token"];
        const refreshToken = req.signedCookies["refresh-token"];

        if (accessToken || refreshToken) {
            res.redirect("/");
            return;
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export function guestGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.signedCookies["access-token"];
        const refreshToken = req.signedCookies["refresh-token"];

        if (accessToken || refreshToken) {
            next(
                response({
                    statusCode: 403,
                    message: "you are already logged in",
                    redirect: "/",
                })
            );
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
}
