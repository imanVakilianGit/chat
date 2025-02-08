import { ObjectId } from "mongoose";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { CreateGroupDtoInterface } from "./common/interface/dto/create.interface";

class GroupServiceClass {
    private readonly _groupRepository = GroupRepository;
    private readonly _userRepository = UserRepository;

    async create(dto: CreateGroupDtoInterface & { owner: ObjectId }) {
        await this._checkExistsByLink(dto.link);
        const result = await this._groupRepository.create(dto);
        await this._userRepository.addGroup(dto.owner, { groupId: result._id });
    }

    // =====================================================

    private async _checkExistsByLink(link: string) {
        const group = await this._groupRepository.findOneByName(link);
        if (group)
            throw exceptionHandler({
                statusCode: 401,
                message: "group already exists",
            });
    }
}

export const GroupService = new GroupServiceClass();
