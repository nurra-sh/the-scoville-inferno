import { User } from '../../auth/types/auth.types'

export interface UpdateProfileBody {
  fullName?: string
  phone?: string | null
  city?: string | null
  shippingAddress?: string | null
}

export interface UpdateProfileResponse {
  message: string
  user: User
}