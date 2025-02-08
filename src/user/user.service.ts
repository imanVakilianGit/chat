import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { JwtService } from "../jwt/jwt.service";
import { CreateUserDtoInterface } from "./common/interface/dto/create.interface";

class UserServiceClass {
    private readonly _userRepository = UserRepository;
    private readonly _jwtService = JwtService;

    async create(dto: CreateUserDtoInterface & { email: string }) {
        const user = await this._userRepository.create(dto);

        const accessToken = this._jwtService.generateAccessToken({
            userId: user._id.toString(),
        });
        const refreshToken = this._jwtService.generateRefreshToken({
            userId: user._id.toString(),
        });

        return { accessToken, refreshToken };
    }
}

export const UserService = new UserServiceClass();
