import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { OrderPaymentMethods, OrderStatus } from '#enums/order_enum'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import OrderItem from './order_item.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare status: OrderStatus

  @column()
  declare paymentMethod: OrderPaymentMethods

  @column()
  declare stripeSessionId: string | null

  @column()
  declare fullName: string

  @column()
  declare phone: string

  @column()
  declare city: string

  @column()
  declare shippingAddress: string

  @column()
  declare total: number

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}