import * as jwt from "jsonwebtoken";

class JwtServiceClass {
    private readonly _jwt = jwt;

    generateAccessToken(payload: { userId: string }) {
        return this._jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET ?? "", {
            expiresIn: 1000 * 60 * 10,
        });
    }

    generateRefreshToken(payload: { userId: string }) {
        return this._jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET ?? "", {
            expiresIn: 1000 * 60 * 24 * 21,
        });
    }
}

export const JwtService = new JwtServiceClass();
