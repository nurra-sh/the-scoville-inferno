import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(1).maxLength(255).optional().nullable(),
    phone: vine.string().trim().minLength(1).maxLength(50).optional().nullable(),
    city: vine.string().trim().minLength(1).maxLength(255).optional().nullable(),
    shippingAddress: vine.string().trim().minLength(1).maxLength(255).optional().nullable(),
  })
)