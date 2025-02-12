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

    findAllWithSearch(data: { input: string; userId }) {
        return this._model.find({
            // users: { $not: data.userId },
            users: { $not: { $eq: data.userId } },
            $text: { $search: data.input },
        });
        // return this._model.find({ link: data.input });
    }

    findOneByName(link: string) {
        return this._model.findOne({ link });
    }

    findOneById(id: string) {
        return this._model.findById(id);
    }

    async joinToGroup(data: { id: string; userId: string }) {
        const group = await this._model.findOne({ _id: data.id });
        group?.users?.push(data.userId as any);
        group?.save();
    }
}

export const GroupRepository = new GroupRepositoryClass();
