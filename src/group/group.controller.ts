import { NextFunction, Request, Response } from "express";
import { GroupService } from "./group.service";
import { response } from "../common/function/response.func";

class GroupControllerClass {
    private readonly _groupService = GroupService;

    renderCreate(req: Request, res: Response, next: NextFunction) {
        res.render("create-group");
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            await this._groupService.create({
                ...body,
                owner: req["user"]._id,
            });
            res.json(response({ redirect: "/" }));
        } catch (error) {
            next(error);
        }
    }
}

export const GroupController = new GroupControllerClass();
