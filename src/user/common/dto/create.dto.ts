import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { exceptionHandler } from "../../../common/function/exception-handler.func";
import { omitFalsyValue } from "../../../common/function/omit-falsy-value.func";
import { CreateUserDtoInterface } from "../interface/dto/create.interface";

const CreateDtoValidator = z.object({
    firstName: z
        .string({ message: "first name must be string" })
        .min(1, "first name must not be less than 1 characters")
        .max(25, "first name must not be more than 25 characters"),
    lastName: z
        .string({ message: "last name must be string" })
        .min(1, "last name must not be less than 1 characters")
        .max(25, "last name must not be more than 25 characters")
        .nullable()
        .optional(),
    bio: z
        .string({ message: "bio must be string" })
        .min(1, "bio must not be less than 1 characters")
        .max(100, "bio must not be more than 100 characters")
        .nullable()
        .optional(),
});

export function createUserDto(
    req: Request<any, any, CreateUserDtoInterface>,
    res: Response,
    next: NextFunction
): void {
    try {
        const dto = omitFalsyValue(req.body);
        const validate = CreateDtoValidator.safeParse(dto);

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
