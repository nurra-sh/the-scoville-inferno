import CartItem from '#models/cart_item'
import Product from '#models/product'
import { addToCartValidator, updateCartItemValidator } from '#validators/cart'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
    async index({ auth, response }: HttpContext) {
        await auth.authenticate()

        const user = auth.getUserOrFail()

        return response.ok(await this.getCart(user.id))
    }

    async store({ auth, request, response }: HttpContext) {
        await auth.authenticate()

        const user = auth.getUserOrFail()
        const { productId, quantity } = await request.validateUsing(addToCartValidator)

        const product = await Product.query().where('id', productId).where('is_active', true).first()

        if (!product) {
            return response.notFound({ message: 'Product not found' })
        }
        if (!product.inStock) {
            return response.badRequest({ message: 'Product is out of stock' })
        }

        const qty = quantity ?? 1
        const existing = await CartItem.query()
            .where('user_id', user.id)
            .where('product_id', productId)
            .first()

        if (existing) {
            existing.quantity = Math.min(existing.quantity + qty, 99)
            await existing.save()
        }
        else {
            await CartItem.create({
                userId: user.id,
                productId,
                quantity: qty
            })
        }

        return response.created(await this.getCart(user.id))
    }

    async update({ auth, params, request, response }: HttpContext) {
        await auth.authenticate()

        const user = auth.getUserOrFail()
        const { quantity } = await request.validateUsing(updateCartItemValidator)

        const item = await CartItem.query()
            .where('id', params.id)
            .where('user_id', user.id)
            .first()

        if (!item) {
            return response.notFound({ message: 'Cart item not found' })
        }

        item.quantity = quantity
        await item.save()

        return response.ok(await this.getCart(user.id))
    }

    async destroy({ auth, params, response }: HttpContext) {
        await auth.authenticate()

        const user = auth.getUserOrFail()
        
        const item = await CartItem.query()
            .where('id', params.id)
            .where('user_id', user.id)
            .first()

        if (!item) {
            return response.notFound({ message: 'Cart item not found' })
        }

        await item.delete()

        return response.ok(await this.getCart(user.id))
    }

    async clear({ auth, response }: HttpContext) {
        await auth.authenticate()

        const user = auth.getUserOrFail()
        
        await CartItem.query().where('user_id', user.id).delete()

        return response.ok(await this.getCart(user.id))
    }

    private async getCart(userId: number) {
        const items = await CartItem.query()
        .where('user_id', userId)
        .preload('product', (q) => {
            q.preload('category').preload('brand').preload('heatLevel')
        })
        .orderBy('created_at', 'desc')
        .orderBy('id', 'desc')

        const subtotal = items.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0
        )

        const totalQuanity = items.reduce((sum, item) => sum + item.quantity, 0)

        return {
            data: items,
            summary: {
                totalItems: items.length,
                totalQuanity,
                subtotal: Math.round(subtotal * 100) / 100
            }
        }
    }
}