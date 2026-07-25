import type { HttpContext } from '@adonisjs/core/http'
import Category from "#models/category"

export default class CategoriesController {
    async index({ response }: HttpContext) {
        const query = await Category.query().orderBy('updatedAt')
        return response.json({
            data: query,
        })
    }
}