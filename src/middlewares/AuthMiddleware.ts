import { Context, Next } from "hono";
import { respond } from "../utils/response";
import { JWT } from "../utils/jwt";
import { getCookie } from "hono/cookie";

export class AuthMiddleware {

    // validate given access token
    async accessTokenValidation(c: Context, next: Next){
        const bearerToken = c.req.header().authorization; 

        if (!bearerToken) return c.json(respond(
            null, false, "Token sudah tidak valid lagi"
        ), 401)

        const authToken = bearerToken.split(' ')[1];
        const {userId} = await JWT.verify(authToken)

        if(!userId){
            return c.json(respond(
                null, false, "Token sudah tidak valid lagi"
            ), 401)
        }

        c.set('userId', userId);
        await next()
    }

    // validate cookie based refresh token
    async refreshTokenValidation(c: Context, next: Next){
        const refreshToken = getCookie(c, 'refresh_token');
        const {userId} = await JWT.verify(refreshToken as string);
        
        if(!userId){
            return c.json(respond(
                null, false, "Token sudah tidak valid lagi, Mohon login ulang."
            ), 401)
        }

        c.set('userId', userId)
        await next()
    }
}
