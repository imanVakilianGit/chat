import { NextFunction, Request, Response } from "express";
import { GroupService } from "./group.service";
import { response } from "../common/function/response.func";
import { CreateGroupDtoInterface } from "./common/interface/dto/create.interface";

class GroupControllerClass {
    private readonly _groupService = GroupService;

    renderCreate(req: Request, res: Response, next: NextFunction) {
        res.render("create-group");
    }

    async create(
        req: Request<any, any, CreateGroupDtoInterface>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const dto = req.body;

            await this._groupService.create({
                ...dto,
                owner: req["user"]._id,
            });
            res.json(response({ statusCode: 201, redirect: "/" }));
        } catch (error) {
            next(error);
        }
    }
}

export const GroupController = new GroupControllerClass();
