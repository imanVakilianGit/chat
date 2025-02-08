import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { SignupDtoInterface } from "../interface/dto/signup.interface";
import { exceptionHandler } from "../../../common/function/exception-handler.func";
import { omitFalsyValue } from "../../../common/function/omit-falsy-value.func";

const SignupDtoValidator = z.object({
    email: z
        .string({ message: "email must be string" })
        .email("email is invalid")
        .min(6, "email must not be less than 6 characters")
        .max(30, "email must not be more than 30 characters"),
});

export function signupDto(
    req: Request<any, any, SignupDtoInterface>,
    res: Response,
    next: NextFunction
): void {
    try {
        const dto = omitFalsyValue(req.body);
        const validate = SignupDtoValidator.safeParse(dto);

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
