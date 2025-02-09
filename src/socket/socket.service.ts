import { Server, Socket } from "socket.io";
import { JwtService } from "../jwt/jwt.service";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";
import { ObjectId } from "mongoose";
import { UserInterface } from "../database/mongo-db/model/user.model";
import { GroupMessageRepository } from "../database/mongo-db/repository/group-message.repository";

export class SocketServiceClass {
    private static _instance: SocketServiceClass;
    private _io: Server;
    private readonly _jwtService = JwtService;
    private readonly _userRepository = UserRepository;
    private readonly _groupRepository = GroupRepository;
    private readonly _groupMessageRepository = GroupMessageRepository;

    constructor(io: Server) {
        this._io = io;
        this._main();
    }

    public static getInstance(io: Server): SocketServiceClass {
        if (!this._instance) {
            this._instance = new SocketServiceClass(io);
        }
        return this._instance;
    }

    private _main() {
        this._io.removeAllListeners();
        this._io.on("connection", async (socket) => {
            this._guard(socket);
            this._getGroups(socket);
            this._getGroupMessages(socket);
            this._createGroupMessages(socket);
        });
    }

    private _guard(socket: Socket) {
        socket.use(async (e, next) => {
            const socketId = socket.id;
            const token = socket.handshake.auth.token;

            const { userId } = this._jwtService.verifyAccessToken(token) as any;
            console.dir(
                { "socket.service.ts:32:user": { socketId, token, userId } },
                { depth: null, colors: true }
            );
            const user = await this._userRepository.findOneById(userId);
            if (!user) next(new Error("user not found"));

            socket["user"] = user;
            next();
        });
    }

    private _getGroups(socket: Socket) {
        socket.on("group-list", async () => {
            const groupIds = socket["user"].groups;

            const groups = await this._groupRepository.findAll({
                _id: groupIds ?? [],
            });

            socket.emit("groups", groups);
        });
    }

    private _getGroupMessages(socket: Socket) {
        socket.on("get-group-messages", async (groupId) => {
            console.dir(
                { "socket.service.ts:70:groupId": groupId },
                { depth: null, colors: true }
            );
            const messages =
                await this._groupMessageRepository.findAllGroupMessagesWithPagination(
                    groupId
                );

            socket.emit("group-messages", messages);
        });
    }

    private _createGroupMessages(socket: Socket) {
        socket.on("create-group-message", async ({ groupId, message }) => {
            console.dir(
                { "socket.service.ts:86:data": { groupId, message } },
                { depth: null, colors: true }
            );
            await this._groupMessageRepository.create({
                content: message,
                group: groupId,
                sender: socket["user"]._id,
            });
        });
    }
}
