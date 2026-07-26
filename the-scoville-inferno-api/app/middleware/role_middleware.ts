import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Role from '#models/role'
import { RolesEnum } from '#enums/role_enums'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class RoleMiddleware {
    async handle(ctx: HttpContext, next: NextFn, allowedRoles: RolesEnum[]) {
      const user = ctx.auth.user
  
      if (!user) {
        return ctx.response.unauthorized({ message: 'Unauthorized' })
      }
  
      const role = await Role.find(user.roleId)
  
      if (!role || !allowedRoles.includes(role.name)) {
        return ctx.response.forbidden({
          message: 'You do not have permission to access this resource',
        })
      }
  
      return next()
    }
  }