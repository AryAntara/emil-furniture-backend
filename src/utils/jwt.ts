import { SignJWT, jwtVerify } from "jose";
import { logger } from "../log";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "237489jeifheriu98349r43y78"),
    alg = 'HS256'

export class JWT {

    // generate new token of jwt
    static async generate(payload: any, expirationTime: string) {
        try {
            return await new SignJWT(payload).setExpirationTime(expirationTime).setProtectedHeader({ alg }).sign(secret)
        } catch (e) {
            logger.error(e)
            return ''
        }
    }

    // verify jwt token 
    static async verify(token: string) {
        try {
            const { payload } = await jwtVerify(token, secret)            
            return payload;
        } catch (e) {
            logger.error(e);
            return {};
        }
    }
}