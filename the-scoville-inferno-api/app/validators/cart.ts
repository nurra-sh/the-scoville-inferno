import vine from '@vinejs/vine'

export const addToCartValidator = vine.compile(
    vine.object({
        productId: vine.number().min(1),
        quantity: vine.number().min(1).max(99).optional()
    })
)

export const updateCartItemValidator = vine.compile(
    vine.object({
        quantity: vine.number().min(1).max(99)
    })
)