import type { HttpContext } from '@adonisjs/core/http'

import HeatLevel from "#models/heat_level"

export default class HeatLevelsController {
    async index({ response }: HttpContext) {
        const query = await HeatLevel.query().orderBy('updatedAt')
        return response.json({
          brands: query,
        })
      }
}