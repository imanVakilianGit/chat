import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { exceptionHandler } from "../../../common/function/exception-handler.func";
import { omitFalsyValue } from "../../../common/function/omit-falsy-value.func";
import { CreateGroupDtoInterface } from "../interface/dto/create.interface";
import { SLUGIFY_REGEX } from "../../../common/regex/slugify.regex";

const dtoValidator = z.object({
    name: z
        .string({ message: "name must be string" })
        .min(1, "name must not be less than 1 characters")
        .max(25, "name must not be more than 25 characters"),
    link: z
        .string({ message: "link must be string" })
        .regex(SLUGIFY_REGEX, "link format is invalid")
        .min(1, "link must not be less than 1 characters")
        .max(25, "link must not be more than 25 characters"),
    bio: z
        .string({ message: "bio must be string" })
        .min(1, "bio must not be less than 1 characters")
        .max(100, "bio must not be more than 100 characters")
        .nullable()
        .optional(),
});

export function createGroupDto(
    req: Request<any, any, CreateGroupDtoInterface>,
    res: Response,
    next: NextFunction
): void {
    try {
        const dto = omitFalsyValue(req.body);
        const validate = dtoValidator.safeParse(dto);

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
