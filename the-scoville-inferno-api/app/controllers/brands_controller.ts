import Brand from '#models/brand'
import type { HttpContext } from '@adonisjs/core/http'

export default class BrandsController {
  async index({ response }: HttpContext) {
    const query = await Brand.query().orderBy('updatedAt')
    return response.json({
      data: query,
    })
  }
}