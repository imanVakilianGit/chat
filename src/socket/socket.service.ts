import { Server, Socket } from "socket.io";
import { JwtService } from "../jwt/jwt.service";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { GroupRepository } from "../database/mongo-db/repository/group.repository";
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
        try {
            this._main();
        } catch (error) {
            console.dir(
                { "socket.service.ts:20:error": error },
                { depth: null, colors: true }
            );
            this._main();
        }
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
            // * ===================== initial ===============================================
            await this._initial(socket);

            // * ===================== guard middleware ===============================================

            // socket.use(async (e, next) => {
            //     const socketId = socket.id;
            //     const token = socket.handshake.auth.token;

            //     const { userId } = this._jwtService.verifyRefreshToken(
            //         token
            //     ) as any;

            //     if (!userId) {
            //         next(new Error("token expired"));
            //         return;
            //     }

            //     const user = await this._userRepository.findOneById(userId);
            //     if (!user) {
            //         next(new Error("user not found"));
            //         return;
            //     }

            //     user.groups?.forEach((group) => {
            //         socket.join(`${group}`);
            //     });

            //     console.dir(
            //         {
            //             "socket.service.ts:55:guard middleware": {
            //                 e,
            //                 socketId,
            //                 token,
            //                 userId,
            //                 user: {
            //                     email: user.email,
            //                     firstName: user.firstName,
            //                 },
            //                 rooms: socket.rooms,
            //             },
            //         },
            //         { depth: null, colors: true }
            //     );

            //     socket["user"] = user;
            //     next();
            // });

            // * ===================== group list ===============================================

            socket.on("group-list", async () => {
                const groups = await this._getGroups(socket["user"].groups);

                socket.emit("groups", groups);
            });

            // * ===================== send-message-to-group ===============================================

            socket.on("send-message-to-group", async ({ groupId, content }) => {
                const message = await this._sendMessageToGroup({
                    groupId,
                    content,
                    userId: socket["user"]._id,
                });

                socket.to(groupId).emit("new-message", {
                    content: message.content,
                    sender: {
                        firstName: message.sender["firstName"],
                    },
                });
            });

            // * ===================== get-group-messages ===============================================

            socket.on("get-group-messages", async (groupId) => {
                socket.rooms.forEach((room) => {
                    if (room !== socket.id) socket.leave(room);
                });

                socket.join(groupId);

                const messages = await this._getGroupMessages(
                    groupId,
                    socket["user"]._id
                );

                socket.emit("group-messages", messages);
            });

            // * ===================== search-rooms ===============================================

            socket.on("search-rooms", async (input) => {
                const result = await this._searchRooms(
                    input,
                    socket["user"]._id
                );

                socket.emit("room-search-results", result);
            });

            // * ===================== join-group ===============================================

            socket.on("join-group", async (groupId: string) => {
                const result = await this._joinToGroup(
                    groupId,
                    socket["user"]._id
                );
                if (!result) return;

                socket.join(result.user.groups as any);
                socket["user"] = result.user;

                const groups = await this._getGroups(result.user.groups);
                socket.emit("groups", groups);
            });
        });
    }

    // ====================================================================================================

    private async _initial(socket: Socket) {
        const socketId = socket.id;
        const token = socket.handshake.auth.token;

        const { userId } = this._jwtService.verifyRefreshToken(token) as any;

        if (!userId) {
            throw new Error("token expired");
        }

        const user = await this._userRepository.findOneById(userId);
        if (!user) {
            throw new Error("user not found");
        }

        // user.groups?.forEach((group) => {
        //     socket.join(`${group}`);
        // });

        console.dir(
            {
                "socket.service.ts:55:initial": {
                    socketId,
                    token,
                    userId,
                    user: {
                        email: user.email,
                        firstName: user.firstName,
                    },
                    rooms: socket.rooms,
                },
            },
            { depth: null, colors: true }
        );

        socket["user"] = user;

        socket.emit("user-detail", {
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }

    private async _getGroups(groupIds) {
        const groups = await this._groupRepository.findAll({
            _id: groupIds ?? [],
        });

        return groups;
    }

    private async _getGroupMessages(groupId, userId) {
        const messages = (
            await this._groupMessageRepository.findAllGroupMessagesWithPagination(
                groupId
            )
        ).map((msg) => {
            if (msg.sender["_id"].toString() == userId)
                return {
                    content: msg.content,
                    sender: { firstName: msg.sender["firstName"] },
                    isYou: true,
                };
            return {
                content: msg.content,
                sender: { firstName: msg.sender["firstName"] },
            };
        });

        return messages;
    }

    private async _sendMessageToGroup(data: {
        groupId: string;
        content: string;
        userId;
    }) {
        const message = await this._groupMessageRepository.create({
            content: data.content,
            group: data.groupId as any,
            sender: data.userId,
        });

        return message;
    }

    private async _searchRooms(input: string, userId) {
        const result = await this._groupRepository.findAllWithSearch({
            input,
            userId,
        });
        return result;
    }

    private async _joinToGroup(groupId, userId) {
        const user = await this._userRepository.findOneById(userId);
        const group = await this._groupRepository.findOneById(groupId);
        if (!user || !group) {
            throw new Error();
        }

        if (user.groups?.includes(groupId)) return;
        if (group.users?.includes(userId)) return;

        group.users?.push(userId);
        await group.save();

        user.groups?.push(groupId);
        await user.save();

        return { user, group };
    }
}
