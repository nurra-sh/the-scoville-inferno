import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .enum('status', ['pending', 'paid', 'confirmed', 'cancelled'])
        .notNullable()
        .defaultTo('pending')

      table
        .enum('payment_method', ['debit_card', 'digital_wallet', 'cash_on_delivery'])
        .notNullable()

      table.string('stripe_session_id').nullable()

      table.string('full_name').notNullable()
      table.string('phone').notNullable()
      table.string('city').notNullable()
      table.text('shipping_address').notNullable()

      table.decimal('total', 10, 2).notNullable()
      table.index(['user_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}