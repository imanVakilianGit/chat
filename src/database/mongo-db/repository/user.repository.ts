import { UserModel } from "../model/user.model";

class UserRepositoryClass {
    private readonly _model = UserModel;

    findOneByEmail(email: string) {
        return this._model.findOne({ email });
    }

    findOneById(id: string) {
        return this._model.findById(id);
    }

    create(data: {
        email: string;
        firstName: string;
        lastName?: string;
        bio?: string;
    }) {
        return this._model.create(data);
    }
}

export const UserRepository = new UserRepositoryClass();
