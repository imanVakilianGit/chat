import { Server, Socket } from "socket.io";
import { JwtService } from "../jwt/jwt.service";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";
import { ObjectId } from "mongoose";
import { UserInterface } from "../database/mongo-db/model/user.model";

export class SocketServiceClass {
    private _io: Server;
    private readonly _jwtService = JwtService;
    private readonly _userRepository = UserRepository;
    private readonly _groupRepository = GroupRepository;

    constructor(io: Server) {
        this._io = io;
        // this._main()
        //     .then(() => {})
        //     .catch(() => {});
        this._main();
    }

    private _main() {
        this._io.on("connection", async (socket) => {
            const { socketId, user } = await this._guard(socket);
            this._getGroups(socket, user?._id);
        });
    }

    private async _guard(socket: Socket) {
        const socketId = socket.id;
        const token = socket.handshake.auth.token;

        const { userId } = this._jwtService.verifyAccessToken(token) as any;
        console.dir(
            { "socket.service.ts:32:user": { socketId, token, userId } },
            { depth: null, colors: true }
        );
        const user = await this._userRepository.findOneById(userId);

        return {
            socketId,
            user,
        };
    }

    private _getGroups(socket: Socket, userId?: ObjectId) {
        socket.on("group-list", async () => {
            console.log("=================");
            console.log("group-list");
            const groups = await this._groupRepository.findAll({
                owner: userId,
            });
            // socket.to(socketId).emit("groups", groups);
            socket.emit("groups", groups);
        });
    }
}
