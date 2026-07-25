import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Brand from '#models/brand'

export default class extends BaseSeeder {
  async run() {
    await Brand.updateOrCreateMany('slug', [
      { name: 'El Diablo', slug: 'el-diablo' },
      { name: 'Mad Dog', slug: 'mad-dog' },
      { name: "Da'Bomb", slug: 'da-bomb' },
      { name: "Blair's", slug: 'blairs' },
    ])
  }
}