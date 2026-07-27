import { OrderStatus } from '#enums/order_enum'
import CartItem from '#models/cart_item'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import { checkoutValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'
import { Stripe } from 'stripe'
import env from '#start/env'

export default class OrdersController {
    async index({ auth, response }: HttpContext) {
        await auth.authenticate()
        const user = auth.getUserOrFail()

        const orders = await Order.query()
            .where('user_id', user.id)
            .preload('items')
            .orderBy('created_at', 'desc')

        return response.ok(orders)
    }

    async createCheckoutSession({ auth, request, response }: HttpContext) {
        await auth.authenticate()
        const user = auth.getUserOrFail()

        const { fullName, phone, city, shippingAddress, paymentMethod } =
            await request.validateUsing(checkoutValidator)

        const cartItems = await CartItem.query()
            .where('user_id', user.id)
            .preload('product')

        if (cartItems.length === 0) {
            return response.badRequest({ message: 'Cart is empty' })
        }

        const total = cartItems.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
        )

        const order = await Order.create({
            userId: user.id,
            status: OrderStatus.PENDING,
            paymentMethod,
            fullName, phone, city, shippingAddress,
            total: Math.round(total * 100) / 100,
        })

        await OrderItem.createMany(
            cartItems.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                productName: item.product.name,
                price: Number(item.product.price),
                quantity: item.quantity,
            }))
        )

        const stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map((item) => ({
                quantity: item.quantity,
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(Number(item.product.price) * 100), // $32.95 = 3295 центов
                    product_data: { name: item.product.name },
                },
            })),
            mode: 'payment',
            success_url: `${env.get('FRONTEND_URL')}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.get('FRONTEND_URL')}/checkout`,
            metadata: { orderId: String(order.id) },
        })

        await order.merge({ stripeSessionId: session.id }).save()

        return response.ok({ url: session.url, orderId: order.id })
    }

    async createCodOrder({ auth, request, response }: HttpContext) {
        await auth.authenticate()
        const user = auth.getUserOrFail()

        const { fullName, phone, city, shippingAddress, paymentMethod } =
            await request.validateUsing(checkoutValidator)

        const cartItems = await CartItem.query()
            .where('user_id', user.id)
            .preload('product')

        if (cartItems.length === 0) {
            return response.badRequest({ message: 'Cart is empty' })
        }

        const total = cartItems.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
        )

        const order = await Order.create({
            userId: user.id,
            status: OrderStatus.CONFIRMED,
            paymentMethod,
            fullName, phone, city, shippingAddress,
            total: Math.round(total * 100) / 100,
        })

        await CartItem.query().where('user_id', user.id).delete()

        return response.created({ order })
    }

    // stripe listen --forward-to localhost:3333/api/v1/webhooks/stripe
    async handleWebhook({ request, response }: HttpContext) {
        const sig = request.header('stripe-signature')

        const stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))

        // Защита от подделки запросов
        const event = stripe.webhooks.constructEvent(
            request.raw() ?? '',
            sig ?? '',
            env.get('STRIPE_WEBHOOK_SECRET')
        )

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const orderId = session.metadata?.orderId

            const order = await Order.find(Number(orderId))
            if (order?.status === OrderStatus.PENDING) {
                await order.merge({ status: OrderStatus.PAID }).save()
                await CartItem.query().where('user_id', order.userId).delete()
            }

            return response.ok({ received: true })
        }
    }
}