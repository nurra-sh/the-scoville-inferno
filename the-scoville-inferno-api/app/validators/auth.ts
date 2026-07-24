import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({email: vine.string().email().normalizeEmail(),
  password: vine.string(),
})
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine
    .string()
    .trim()
    .email()
    .normalizeEmail()
    .unique(async (db, value) => {
        const matchedUser = await db.from('users').select('id').where('email', value).first()
        return !matchedUser
    }),
    password: vine
    .string()
    .trim()
    .minLength(8)
    .maxLength(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .confirmed(),
    fullName: vine.string().trim()
  })
  
)
