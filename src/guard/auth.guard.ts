import { NextFunction, Request, Response } from "express";
import { response } from "../common/function/response.func";
import { JwtService } from "../jwt/jwt.service";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { ACCESS_TOKEN_COOKIE_OPTION } from "../cookie/option/access-token.option";
import { REFRESH_TOKEN_COOKIE_OPTION } from "../cookie/option/refresh-token.option";
import { exceptionHandler } from "../common/function/exception-handler.func";

export async function renderAuthGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.signedCookies["access-token"];
        const refreshToken = req.signedCookies["refresh-token"];

        if (!accessToken || !refreshToken) {
            res.redirect("/auth/signin");
            return;
        }

        const validateAccessToken = JwtService.verifyAccessToken(
            accessToken
        ) as any;
        const validateRefreshToken = JwtService.verifyRefreshToken(
            refreshToken
        ) as any;

        if (validateAccessToken["userId"]) {
            const user = await UserRepository.findOneById(
                validateAccessToken["userId"]
            );
            if (!user) {
                res.redirect("/auth/signup");
                return;
            }
            res.cookie("socket-token", accessToken);
            req["user"] = user;
            next();
            return;
        }

        if (!validateAccessToken["expiredAt"]) {
            res.redirect("/auth/signin");
            return;
        }

        if (!validateRefreshToken["userId"]) {
            res.redirect("/auth/signin");
            return;
        }

        const user = await UserRepository.findOneById(
            validateRefreshToken["userId"]
        );
        if (!user) {
            res.redirect("/auth/signup");
            return;
        }

        const newAccessToken = JwtService.generateAccessToken({
            userId: user._id.toString(),
        });
        const newRefreshToken = JwtService.generateRefreshToken({
            userId: user._id.toString(),
        });

        res.cookie("access-token", newAccessToken, ACCESS_TOKEN_COOKIE_OPTION);
        res.cookie(
            "refresh-token",
            newRefreshToken,
            REFRESH_TOKEN_COOKIE_OPTION
        );
        res.cookie("socket-token", newAccessToken);

        req["user"] = user;
        next();
    } catch (error) {
        console.dir(
            { "auth.guard.ts:75:error": error },
            { depth: null, colors: true }
        );
        next();
    }
}

export async function authGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.signedCookies["access-token"];
        const refreshToken = req.signedCookies["refresh-token"];

        if (!accessToken || !refreshToken) {
            next(
                response({
                    statusCode: 403,
                    message: "need to login",
                    redirect: "/auth/signin",
                })
            );
            return;
        }

        const validateAccessToken = JwtService.verifyAccessToken(
            accessToken
        ) as any;
        const validateRefreshToken = JwtService.verifyRefreshToken(
            refreshToken
        ) as any;

        if (validateAccessToken["userId"]) {
            const user = await UserRepository.findOneById(
                validateAccessToken["userId"]
            );
            if (!user) {
                next(
                    exceptionHandler({
                        statusCode: 403,
                        redirect: "/auth/signup",
                    })
                );
                return;
            }
            res.cookie("socket-token", accessToken);
            req["user"] = user;
            next();
            return;
        }

        if (!validateAccessToken["expiredAt"]) {
            next(
                exceptionHandler({ statusCode: 403, redirect: "/auth/signin" })
            );
            return;
        }

        if (!validateRefreshToken["userId"]) {
            next(
                exceptionHandler({ statusCode: 403, redirect: "/auth/signin" })
            );
            return;
        }

        const user = await UserRepository.findOneById(
            validateRefreshToken["userId"]
        );
        if (!user) {
            next(
                exceptionHandler({
                    statusCode: 403,
                    redirect: "/auth/signup",
                })
            );
            return;
        }

        const newAccessToken = JwtService.generateAccessToken({
            userId: user._id.toString(),
        });
        const newRefreshToken = JwtService.generateRefreshToken({
            userId: user._id.toString(),
        });

        res.cookie("access-token", newAccessToken, ACCESS_TOKEN_COOKIE_OPTION);
        res.cookie(
            "refresh-token",
            newRefreshToken,
            REFRESH_TOKEN_COOKIE_OPTION
        );
        res.cookie("socket-token", newAccessToken);
        req["user"] = user;
        next();
    } catch (error) {
        next(error);
    }
}
