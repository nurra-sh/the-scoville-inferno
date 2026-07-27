export type PaymentMethod = 'debit_card' | 'digital_wallet' | 'cash_on_delivery'
export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'cancelled'

export interface OrderItem {
    id: number
    orderId: number
    productId: number | null
    productName: string
    price: number
    quantity: number
}

export interface Order {
    id: number
    userId: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    stripeSessionId: string | null
    fullName: string
    phone: string
    city: string
    shippingAddress: string
    total: number
    items: OrderItem[]
    createdAt: string
    updatedAt: string | null
}

export interface CheckoutFormValue {
    fullName: string
    phone: string
    city: string
    shippingAddress: string
    paymentMethod: PaymentMethod
}

export interface CreateStripeSessionResponse {
    url: string
    orderId: number
}

export interface CreateCodOrderResponse {
    order: Order
}

export interface HandleWebhookResponse {
    recieved: boolean
}