import { Context } from "hono";
import { AuthService } from "../modules/auth/AuthService";
import { registerSchemaValidator } from "../modules/auth/schemas/RegisterSchema";
import { loginSchemaValidator } from "../modules/auth/schemas/LoginSchema";
import { BaseController } from "./BaseController";
import { logger } from "../log";
import { getBaseUrl } from "../utils/url";
import { setCookie } from "hono/cookie"

const DAYS_IN_SECOND = 24 * 60 * 60;

export class AuthController extends BaseController {
    constructor(public authService: AuthService) {
        super()
    }

    // register new user into system
    async register(c: Context) {
        const content = await c.req.parseBody()
        const validation = await registerSchemaValidator.with(content as unknown).run();

        logger.info('New request for register user.')
        if (!validation.success) {
            logger.info("Invalid Argument from the request")
            return c.json(this.respond(validation.errors, false, "Validasi error"), 400)
        }

        const userData = validation.data;
        const userEntry = await this.authService.insertUser(userData)
        if (!userEntry) {
            return c.json(this.respond(null, false, 'Gagal menambahkan user'), 500)
        }

        const email = userEntry.getDataValue('email');
        const url = getBaseUrl(c.req.url);
        const verifycationLink = url + '/auth/verify/' + await this.authService.generateEmailVerificationToken(
            email,
            userEntry.getDataValue('id'),
        );

        await this.authService.sendVerifcationEmail(email, verifycationLink);
        return c.json(this.respond({}, true, "Berhasil menambahkan user"));
    }

    // verify the email
    async verify(c: Context) {
        const token = c.req.param().token;
        if (!await this.authService.verifyUserEmail(token))
            return c.json(this.respond(null, false, 'Token tidak valid.'), 402);
        return c.json(this.respond(null, true, 'Berhasil melakukan verifikasi'));
    }

    // login into our account
    async login(c: Context) {
        const content = await c.req.parseBody();
        const validation = await loginSchemaValidator.with(content).run();

        logger.info('New request for login user.')
        if (!validation.success) {
            logger.info("Invalid Argument from the request")
            return c.json(this.respond(validation.errors, false, "Validasi error"), 400)
        }

        const email = validation.data.email;
        const userEntry = await this.authService.getUserDataByEmail(email);

        if (!userEntry) return c.json(this.respond({}, false, "User tidak ditemukan"), 404)

        const userId = userEntry.getDataValue('id'),
            fullname = userEntry.getDataValue('fullname'),
            authToken = await this.authService.generateAuthToken(userId),
            refreshToken = await this.authService.generateRefreshToken(userId)


        setCookie(c, 'refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: DAYS_IN_SECOND

        });

        const response = {
            accessToken: authToken,
            email,
            userId,
            fullname
        }

        return c.json(this.respond(response, true, 'Berhasil login.'))
    }

    // logout from system 
    async logout(c: Context) {
        return c.json(this.respond({}, true, "Berhasil logout."))
    }

    // generate new token 
    async renew(c: Context) {
        const accessToken = await this.authService.generateAuthToken(c.get('userId'));
        return c.json(this.respond({
            accessToken
        }, true, "Mendapatkan token baru."));
    }
}
