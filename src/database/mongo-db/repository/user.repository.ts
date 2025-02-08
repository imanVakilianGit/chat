import { ObjectId } from "mongoose";
import { UserModel } from "../model/user.model";
import { CreateUserDtoInterface } from "../../../user/common/interface/dto/create.interface";

class UserRepositoryClass {
    private readonly _model = UserModel;

    findOneByEmail(email: string) {
        return this._model.findOne({ email });
    }

    findOneById(id: string | ObjectId) {
        return this._model.findById(id);
    }

    create(data: CreateUserDtoInterface & { email: string }) {
        return this._model.create(data);
    }

    async addGroup(id: ObjectId, data: { groupId: ObjectId }) {
        const user = await this.findOneById(id);
        if (!user) throw "";

        user.groups?.push(data.groupId);
        user.save();
    }
}

export const UserRepository = new UserRepositoryClass();
