import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { JwtService } from "../jwt/jwt.service";

class UserServiceClass {
    private readonly _userRepository = UserRepository;
    private readonly _jwtService = JwtService;

    async create(dto: {
        email: string;
        firstName: string;
        lastName?: string;
        bio?: string;
    }) {
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
