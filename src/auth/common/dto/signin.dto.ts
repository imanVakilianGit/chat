import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { exceptionHandler } from "../../../common/function/exception-handler.func";
import { SigninDtoInterface } from "../interface/dto/signin.interface";
import { omitFalsyValue } from "../../../common/function/omit-falsy-value.func";

const SigninDtoValidator = z.object({
    email: z
        .string({ message: "email must be string" })
        .email("email is invalid")
        .min(6, "email must not be less than 6 characters")
        .max(30, "email must not be more than 30 characters"),
});

export function signinDto(
    req: Request<any, any, SigninDtoInterface>,
    res: Response,
    next: NextFunction
): void {
    try {
        const dto = omitFalsyValue(req.body);
        const validate = SigninDtoValidator.safeParse(dto);

        if (!validate.success) {
            const message: string = validate.error?.issues[0].message;
            const statusCode = 400;
            next(exceptionHandler({ statusCode, message }));
        }

        next();
    } catch (error) {
        next(error);
    }
}
