import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { response } from "../common/function/response.func";
import { ACCESS_TOKEN_COOKIE_OPTION } from "../cookie/option/access-token.option";
import { REFRESH_TOKEN_COOKIE_OPTION } from "../cookie/option/refresh-token.option";

class UserControllerClass {
    private readonly _userService = UserService;

    renderCreate(req: Request, res: Response, next: NextFunction): void {
        const cookie = req.signedCookies["create-account-permission"];
        if (!cookie) {
            res.redirect("/auth/signup");
            return;
        }

        res.render("create-account");
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const cookie = req.signedCookies["create-account-permission"];
            if (!cookie)
                throw exceptionHandler({
                    statusCode: 403,
                    redirect: "/auth/signup",
                });

            const dto = { email: cookie.email, firstName: body.firstName };
            if (body.lastName) Object.assign({ lastName: body.lastName }, dto);
            if (body.bio) Object.assign({ bio: body.bio }, dto);
            console.dir(
                { "user.controller.ts:32:dto": dto },
                { depth: null, colors: true }
            );

            const result = await this._userService.create(dto);

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

            res.clearCookie("create-account-permission");

            res.json(response({ statusCode: 201, redirect: "/" }));
        } catch (error) {
            next(error);
        }
    }
}

export const UserController = new UserControllerClass();
