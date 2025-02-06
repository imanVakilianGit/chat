import { ObjectId } from "mongoose";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";

class GroupServiceClass {
    private readonly _groupRepository = GroupRepository;

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
        await this._groupRepository.create(dto);
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
