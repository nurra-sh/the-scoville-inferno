import { Product } from '../../products/types/products.types'

export interface CartItem {
  id: number
  userId: number
  productId: number
  quantity: number
  product: Product
  createdAt: string
  updatedAt: string | null
}

export interface CartSummary {
  totalItems: number
  totalQuantity: number
  subtotal: number
}

export interface GetCartResponse {
  data: CartItem[]
  summary: CartSummary
}

export interface AddToCartBody {
  productId: number
  quantity?: number
}

export interface UpdateCartItemBody {
  quantity: number
}