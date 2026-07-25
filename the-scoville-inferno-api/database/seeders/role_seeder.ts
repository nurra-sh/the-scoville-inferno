import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { RolesEnum } from '../../app/enums/role_enums.js'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('name', [
      { id: 1, name: RolesEnum.USER, description: 'Обычный пользователь' },
      { id: 2, name: RolesEnum.ADMIN, description: 'Админ' },
    ])
  }
}