import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
      .integer('role_id')
      .notNullable()
      .unsigned()
      .defaultTo(1)
      .references('id')
      .inTable('roles')
      .onDelete('RESTRICT') // RESTRICT - не даем удалить роль, если к ней привязаны юзеры
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table)=> {
      table.dropForeign(['role_id'])
      table.dropColumn('role_id')
    })
  }
}