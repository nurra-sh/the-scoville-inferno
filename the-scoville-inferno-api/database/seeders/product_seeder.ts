import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import Category from '#models/category'
import Brand from '#models/brand'
import HeatLevel from '#models/heat_level'

export default class extends BaseSeeder {
  async run() {
    const sauces = await Category.findByOrFail('slug', 'hot-sauces')
    const elDiablo = await Brand.findByOrFail('slug', 'el-diablo')
    const hot = await HeatLevel.findByOrFail('slug', 'hot')
    const insane = await HeatLevel.findByOrFail('slug', 'insane')

    await Product.updateOrCreateMany('slug', [
      {
        name: 'Ghost Pepper Sauce',
        slug: 'ghost-pepper-sauce',
        description: 'Соус на основе перца Bhut Jolokia.',
        price: 12.99,
        scoville: 855000,
        inStock: true,
        isActive: true,
        categoryId: sauces.id,
        brandId: elDiablo.id,
        heatLevelId: hot.id,
      },
      {
        name: 'Carolina Reaper Extract',
        slug: 'carolina-reaper-extract',
        description: 'Экстракт из самого острого перца в мире.',
        price: 24.5,
        scoville: 2200000,
        inStock: true,
        isActive: true,
        categoryId: sauces.id,
        brandId: elDiablo.id,
        heatLevelId: insane.id,
      },
    ])
  }
}