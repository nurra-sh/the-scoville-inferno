import { BaseSeeder } from '@adonisjs/lucid/seeders'
import HeatLevel from '#models/heat_level'

export default class extends BaseSeeder {
  async run() {
    await HeatLevel.updateOrCreateMany('slug', [
      { name: 'Mild', slug: 'mild', minScoville: 0, maxScoville: 2500, sortOrder: 1 },
      { name: 'Medium', slug: 'medium', minScoville: 2500, maxScoville: 25000, sortOrder: 2 },
      { name: 'Hot', slug: 'hot', minScoville: 25000, maxScoville: 100000, sortOrder: 3 },
      { name: 'Extreme', slug: 'extreme', minScoville: 100000, maxScoville: 1000000, sortOrder: 4 },
      { name: 'Insane', slug: 'insane', minScoville: 1000000, maxScoville: null, sortOrder: 5 },
    ])
  }
}