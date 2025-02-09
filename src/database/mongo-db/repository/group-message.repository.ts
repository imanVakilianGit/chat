import { ObjectId } from "mongoose";
import { GroupMessageModel } from "../model/group-message.model";

class GroupMessageRepositoryClass {
    private readonly _model = GroupMessageModel;

    create(data: {
        content: string;
        sender: ObjectId;
        group: ObjectId;
        replyTo?: ObjectId;
    }) {
        return this._model.create(data);
    }

    findAllGroupMessagesWithPagination(groupId: ObjectId | string) {
        return this._model.find({ group: groupId });
    }
}

export const GroupMessageRepository = new GroupMessageRepositoryClass();
