import { ObjectId } from "mongoose";
import { GroupMessageModel } from "../model/group-message.model";

class GroupMessageRepositoryClass {
    private readonly _model = GroupMessageModel;

    async create(data: {
        content: string;
        sender: ObjectId;
        group: ObjectId;
        replyTo?: ObjectId;
    }) {
        return (await this._model.create(data)).populate("sender");
    }

    findAllGroupMessagesWithPagination(groupId: ObjectId | string) {
        return this._model.find({ group: groupId }).populate("sender");
    }
}

export const GroupMessageRepository = new GroupMessageRepositoryClass();
