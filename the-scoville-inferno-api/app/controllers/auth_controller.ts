import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(loginValidator)

        const user = await User.verifyCredentials(email, password)

        const token = await User.accessTokens.create(user)

        return response.ok({
            type: 'bearer',
            token: token.value!.release(),
            user: user.serialize(),
            message: `Welcome back, ${user.fullName}!`,
        })
    }

    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(registerValidator)

        await User.create(payload)

        return response.created({
            message: 'User registered successfully',
        })
    }

    async me({ auth, response }: HttpContext) {
        await auth.check()
        
        response.ok({
            user: auth.user
        })
    }
}