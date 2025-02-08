import { ObjectId } from "mongoose";
import { GroupModel } from "../model/group.model";

class GroupRepositoryClass {
    private readonly _model = GroupModel;

    create(data: {
        name: string;
        nickName: string;
        bio?: string;
        owner: ObjectId;
    }) {
        return this._model.create({ ...data, users: [data.owner] });
    }

    findAll(data: { users?: ObjectId; _id: ObjectId[] }) {
        return this._model.find(data);
    }

    findOneByName(name: string) {
        return this._model.findOne({ name });
    }
}

export const GroupRepository = new GroupRepositoryClass();
