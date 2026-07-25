import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable()
      table.string('image_url').nullable()
      table.integer('scoville').notNullable().defaultTo(0)
      table.boolean('in_stock').notNullable().defaultTo(true)
      table.boolean('is_active').notNullable().defaultTo(true)

      // Внешние ключи на справочники
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')
      table
        .integer('brand_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('brands')
        .onDelete('SET NULL')
      table
        .integer('heat_level_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('heat_levels')
        .onDelete('SET NULL')

      // Индексы под частые фильтры
      table.index(['category_id'])
      table.index(['brand_id'])
      table.index(['heat_level_id'])
      table.index(['price'])
      table.index(['scoville'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}