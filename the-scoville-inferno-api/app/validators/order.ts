import vine from '@vinejs/vine'
import { OrderPaymentMethods } from '#enums/order_enum'

export const checkoutValidator = vine.compile(
    vine.object({
        fullName: vine.string().trim().minLength(2).maxLength(100),
        phone: vine.string().trim().minLength(5).maxLength(30),
        city: vine.string().trim().minLength(2).maxLength(100),
        shippingAddress: vine.string().trim().minLength(5).maxLength(500),
        paymentMethod: vine.enum(OrderPaymentMethods), // МОЖЕТ СЛОМАТЬСЯ
    })
)