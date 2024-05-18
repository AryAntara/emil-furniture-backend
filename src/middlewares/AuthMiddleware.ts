import { Context, Next } from "hono";
import { respond } from "../utils/response";
import { JWT } from "../utils/jwt";
import { getCookie } from "hono/cookie";

export class AuthMiddleware {

    // validate given access token
    async validateAccessToken(c: Context, next: Next) {
        const bearerToken = c.req.header().authorization;

        if (!bearerToken) return c.json(respond(
            null, false, "Token sudah tidak valid lagi"
        ), 401)

        const authToken = bearerToken.split(' ')[1];
        const { userId, isAdmin, email } = await JWT.verify(authToken)

        if (!userId) {
            
            return c.json(respond(
                null, false, "Token sudah tidak valid lagi"
            ), 401)
        }

        c.set('userId', userId);
        c.set('isAdmin', isAdmin as boolean);
        c.set('email', email as string);
        await next()
    }

    // validate cookie based refresh token
    async validateRefreshToken(c: Context, next: Next) {
        const refreshToken = getCookie(c, 'refresh_token');
        console.log(refreshToken);
        const { userId, email, roleUser } = await JWT.verify(refreshToken as string);

        if (!userId) {
            return c.json(respond(
                null, false, "Token sudah tidak valid lagi, Mohon login ulang."
            ), 401)
        }

        c.set('userId', userId);
        c.set('roleUser', roleUser);
        c.set('email', email);

        await next()
    }


    // validate that token have access to admin 
    async validateAdminAccess(c: Context, next: Next) {
        const isSuperUser = process.env.SUPER_USER == c.get('email');        
        const isAdmin = c.get('isAdmin') as boolean;
        
        if (!isAdmin && !isSuperUser) {
            return c.json(respond(
                null, false, "Akses tidak diizinkan."
            ))
        }

        await next()
    }
}
