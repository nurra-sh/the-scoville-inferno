import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone').nullable()
      table.string('city').nullable()
      table.string('shipping_address').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('phone')
      table.dropColumn('city')
      table.dropColumn('shipping_address')
    })
  }
}