import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.updateOrCreateMany('slug', [
      { name: 'Острые соусы', slug: 'hot-sauces' },
      { name: 'Перцы', slug: 'peppers' },
      { name: 'Снэки', slug: 'snacks' },
      { name: 'Маринады', slug: 'marinades' },
      { name: 'Подарочные наборы', slug: 'gift-sets' },
    ])
  }
}