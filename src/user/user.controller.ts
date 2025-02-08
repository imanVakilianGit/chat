import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { response } from "../common/function/response.func";
import { ACCESS_TOKEN_COOKIE_OPTION } from "../cookie/option/access-token.option";
import { REFRESH_TOKEN_COOKIE_OPTION } from "../cookie/option/refresh-token.option";
import { CreateUserDtoInterface } from "./common/interface/dto/create.interface";

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

    async create(
        req: Request<any, any, CreateUserDtoInterface>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dto = req.body;
            const cookie = req.signedCookies["create-account-permission"];
            if (!cookie)
                throw exceptionHandler({
                    statusCode: 403,
                    redirect: "/auth/signup",
                });

            const result = await this._userService.create({
                ...dto,
                email: cookie.email,
            });

            res.cookie(
                "access-token",
                result.accessToken,
                ACCESS_TOKEN_COOKIE_OPTION
            );

            res.cookie(
                "refresh-token",
                result.refreshToken,
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
