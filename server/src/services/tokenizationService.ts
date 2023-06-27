import jwt from 'jsonwebtoken';
import { getPrismaClient } from "../prismaClient";


class TokenizationService {
    private static accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY as string || 'secret';
    private static accessTokenExpirationTimeInSeconds: number = parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME_IN_SECONDS || '900', 10);
    private static refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY as string || 'accessSecret';
    private static refreshTokenExpirationTimeInSeconds: number = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS || '86400', 10);
    private static prisma = getPrismaClient();

    private static  generateAccessToken (userId: string): string {
        const payload = {
            id: userId,
          };
          const token = jwt.sign(payload, this.accessTokenSecretKey, {expiresIn: this.accessTokenExpirationTimeInSeconds});
          return token;
    }

    private static async generateRefreshToken (userId: string): Promise<string> {
        const payload = {
            id: userId,
          };
          const token = jwt.sign(payload, this.refreshTokenSecretKey, {expiresIn: this.refreshTokenExpirationTimeInSeconds});
          await this.prisma.refreshToken.create({
            data: {
              token,
              userId,
            }   
        });
          return token;
    }

    public static async generateTokenPair (userId: string): Promise<{accessToken: string, refreshToken: string}> {
    return { accessToken: this.generateAccessToken(userId), refreshToken: await this.generateRefreshToken(userId) };}

    public static async validateAccessToken (token: string): Promise<boolean> {
        try {
            const payload = jwt.verify(token, this.accessTokenSecretKey);
            if (typeof payload === 'string') {
                return false; 
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.id,
                },
            });
            if (user) {
                return true;
            }
            return false;
} catch (error) {
    return false;
}}

public static async validateRefreshToken (token: string): Promise<boolean> {
    try {
        const payload = jwt.verify(token, this.refreshTokenSecretKey);
        if (typeof payload === 'string') {
            return false; 
        }
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: {
                token: token,
            },
        });
        if (refreshToken && refreshToken.userId === payload.id) {
            return true;
        }
        return false;
} catch (error) {
    return false;
}}

public static async refreshAccessToken (token: string): Promise<string> {
    try {
        const payload = jwt.verify(token, this.refreshTokenSecretKey);
        if (typeof payload === 'string') {
            throw new Error('Invalid token'); 
        }
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: {
                token: token,
            },
        });
        if (refreshToken && refreshToken.userId === payload.id) {
            return this.generateAccessToken(refreshToken.userId);
        }
        throw new Error('Invalid token');
} catch (error) {
    throw new Error('Invalid token');
}}
}

export default TokenizationService;