import { ObjectId } from "mongoose";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";
import { UserRepository } from "../database/mongo-db/repository/user.repository";

class GroupServiceClass {
    private readonly _groupRepository = GroupRepository;
    private readonly _userRepository = UserRepository;

    async create(dto: {
        owner: ObjectId;
        name: string;
        nickName: string;
        bio?: string;
    }) {
        console.dir(
            { "group.service.ts:14:dto": dto },
            { depth: null, colors: true }
        );
        await this._checkExistsByName(dto.name);
        const result = await this._groupRepository.create(dto);
        await this._userRepository.addGroup(dto.owner, { groupId: result._id });
    }
    // =====================================================
    private async _checkExistsByName(name: string) {
        const group = await this._groupRepository.findOneByName(name);
        if (group)
            throw exceptionHandler({
                statusCode: 401,
                message: "group already exists",
            });
    }
}

export const GroupService = new GroupServiceClass();
