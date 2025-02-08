import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { exceptionHandler } from "../../../common/function/exception-handler.func";
import { VerifyOtpDtoInterface } from "../interface/dto/verify-otp.interface";
import { omitFalsyValue } from "../../../common/function/omit-falsy-value.func";

const VerifyOtpDtoValidator = z.object({
    code: z
        .string({ message: "code must be string" })
        .length(6, "code must be 6 length"),
});

export function verifyOtpDto(
    req: Request<any, any, VerifyOtpDtoInterface>,
    res: Response,
    next: NextFunction
): void {
    try {
        const dto = omitFalsyValue(req.body);
        const validate = VerifyOtpDtoValidator.safeParse(dto);

        if (!validate.success) {
            const message: string = validate.error.issues[0].message;
            const statusCode = 400;
            next(exceptionHandler({ statusCode, message }));
        }

        next();
    } catch (error) {
        next(error);
    }
}
