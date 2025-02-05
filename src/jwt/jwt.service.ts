import * as jwt from "jsonwebtoken";

class JwtServiceClass {
    private readonly _jwt = jwt;

    generateAccessToken(payload: { userId: string }) {
        return this._jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET ?? "", {
            expiresIn: 1 * 60 * 10,
        });
    }

    generateRefreshToken(payload: { userId: string }) {
        return this._jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET ?? "", {
            expiresIn: 1 * 60 * 60 * 24 * 21,
        });
    }

    verifyAccessToken(token: string) {
        try {
            return this._jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET ?? ""
            );
        } catch (error) {
            return error;
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return this._jwt.verify(
                token,
                process.env.REFRESH_TOKEN_SECRET ?? ""
            );
        } catch (error) {
            return error;
        }
    }
}

export const JwtService = new JwtServiceClass();
