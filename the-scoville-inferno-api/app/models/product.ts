import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Brand from './brand.js'
import HeatLevel from './heat_level.js'

// TODO: Сделай так чтобы сиды записывались в базу

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare imageUrl: string | null

  @column()
  declare scoville: number

  @column()
  declare inStock: boolean

  @column()
  declare isActive: boolean

  @column()
  declare categoryId: number

  @column()
  declare brandId: number | null

  @column()
  declare heatLevelId: number | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>

  @belongsTo(() => HeatLevel)
  declare heatLevel: BelongsTo<typeof HeatLevel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}