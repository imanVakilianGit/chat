import { randomInt } from "crypto";
import { UserRepository } from "../database/mongo-db/repository/user.repository";
import { CacheOtpRepository } from "../database/node-cache/otp.repository";
import { JwtService } from "../jwt/jwt.service";
import { exceptionHandler } from "../common/function/exception-handler.func";
import { SignupDtoInterface } from "./common/interface/dto/signup.interface";
import { SigninDtoInterface } from "./common/interface/dto/signin.interface";
import { VerifyOtpDtoInterface } from "./common/interface/dto/verify-otp.interface";

export class AuthServiceClass {
    private readonly _userRepository = UserRepository;
    private readonly _cacheOtpRepository = CacheOtpRepository;
    private readonly _jwtService = JwtService;

    async signup(dto: SignupDtoInterface): Promise<void> {
        await this._checkExistsUserByEmail(dto.email);

        const otpCode = this._createOtpCode();
        console.dir(
            { "auth.service.ts:13:otpCode": otpCode },
            { depth: null, colors: true }
        );
        this._saveOtpCodeIntoCache(dto.email, otpCode);
    }

    async signin(dto: SigninDtoInterface): Promise<void> {
        await this.findOneUserByEmailOrFail(dto.email);

        const otpCode = this._createOtpCode();
        console.dir(
            { "auth.service.ts:13:otpCode": otpCode },
            { depth: null, colors: true }
        );
        this._saveOtpCodeIntoCache(dto.email, otpCode);
    }

    async verifyOtp(
        dto: VerifyOtpDtoInterface & { email: string; isNewUser: boolean }
    ) {
        const otpCode = this._cacheOtpRepository.get(dto.email);
        if (!otpCode)
            throw exceptionHandler({ statusCode: 400, message: "otp expired" });

        console.dir(
            { "auth.service.ts:39:dto": { otpCode, code: dto.code } },
            { depth: null, colors: true }
        );
        if (otpCode !== dto.code)
            throw exceptionHandler({
                statusCode: 400,
                message: "otp is invalid",
            });
        this._cacheOtpRepository.delete(dto.email);

        if (dto.isNewUser) return;

        const user = await this.findOneUserByEmailOrFail(dto.email);

        const accessToken = this._jwtService.generateAccessToken({
            userId: user._id.toString(),
        });
        const refreshToken = this._jwtService.generateRefreshToken({
            userId: user._id.toString(),
        });

        return { accessToken, refreshToken };
    }

    // ===================================================================================

    private async _checkExistsUserByEmail(email: string): Promise<void> {
        const user = await this._userRepository.findOneByEmail(email);
        if (user)
            throw exceptionHandler({
                statusCode: 400,
                message: "user already exists",
            });
    }

    private _saveOtpCodeIntoCache(email: string, otpCode: string): void {
        const isExists: boolean = !!this._cacheOtpRepository.get(email);
        if (isExists)
            throw exceptionHandler({
                statusCode: 400,
                message: "otp not expired yet",
            });

        const result: boolean = this._cacheOtpRepository.set(email, otpCode);
        if (!result) throw exceptionHandler();
    }

    private _createOtpCode(): string {
        return randomInt(100000, 999999).toString();
    }

    private async findOneUserByEmailOrFail(email: string) {
        const user = await this._userRepository.findOneByEmail(email);
        if (!user)
            throw exceptionHandler({
                statusCode: 404,
                message: "user not found",
                redirect: "/auth/signup",
            });
        return user;
    }
}

export const AuthService = new AuthServiceClass();
