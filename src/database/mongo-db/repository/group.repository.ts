import { ObjectId } from "mongoose";
import { GroupModel } from "../model/group.model";
import { CreateGroupDtoInterface } from "../../../group/common/interface/dto/create.interface";

class GroupRepositoryClass {
    private readonly _model = GroupModel;

    create(data: CreateGroupDtoInterface & { owner: ObjectId }) {
        return this._model.create({ ...data, users: [data.owner] });
    }

    findAll(data: { users?: ObjectId; _id: ObjectId[] }) {
        return this._model.find(data);
    }

    findOneByName(link: string) {
        return this._model.findOne({ link });
    }
}

export const GroupRepository = new GroupRepositoryClass();
