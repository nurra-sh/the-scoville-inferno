import { updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async update({ auth, request, response }: HttpContext) {
    await auth.authenticate()

    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateProfileValidator)

    user.merge(payload)

    await user.save()
    return response.ok({
      message: 'User profile updated',
      user: user.serialize(),
    })
  }
}