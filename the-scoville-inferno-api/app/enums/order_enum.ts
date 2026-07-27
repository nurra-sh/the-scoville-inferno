export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

export enum OrderPaymentMethods {
    DEBIT_CARD = 'debit_card',
    DIGITAL_WALLET = 'digital_wallet',
    CASH_ON_DELIVERY = 'cash_on_delivery',
}