import { GroupModel } from "../model/group.model";

class GroupRepositoryClass {
    private readonly _model = GroupModel;

    create(data: { name: string; nickName: string; bio?: string }) {
        return this._model.create(data);
    }

    findAll(data: {}) {
        return this._model.find(data);
    }

    findOneByName(name: string) {
        return this._model.findOne({ name });
    }
}

export const GroupRepository = new GroupRepositoryClass();
