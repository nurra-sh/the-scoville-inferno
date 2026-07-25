import Product from '#models/product'
import { ProductsOrderColumnsEnum } from '#enums/product_enums'
import { productsIndexValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const filters = await request.validateUsing(productsIndexValidator, {
      data: request.qs(),
    })

    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 12
    const order = filters.order ?? 'desc'

    const query = Product.query()
      .where('is_active', true)
      .preload('category', (q) => q.select())
      .preload('brand', (q) => q.select())
      .preload('heatLevel', (q) => q.select())

    if (filters.categoryId) {
      query.where('category_id', filters.categoryId)
    }
    if (filters.categorySlug) {
      query.whereHas('category', (q) => q.where('slug', filters.categorySlug!))
    }
    if (filters.brandId) {
      query.where('brand_id', filters.brandId)
    }
    if (filters.brandSlug) {
      query.whereHas('brand', (q) => q.where('slug', filters.brandSlug!))
    }
    if (filters.heatLevelId) {
      query.where('heat_level_id', filters.heatLevelId)
    }
    if (filters.heatLevelSlug) {
      query.whereHas('heatLevel', (q) => q.where('slug', filters.heatLevelSlug!))
    }

    if (filters.minPrice !== undefined && filters.minPrice >= 0) {
      query.where('price', '>=', filters.minPrice)
    }
    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
      query.where('price', '<=', filters.maxPrice)
    }

    if (filters.minScoville !== undefined && filters.minScoville >= 0) {
      query.where('scoville', '>=', filters.minScoville)
    }
    if (filters.maxScoville !== undefined && filters.maxScoville >= 0) {
      query.where('scoville', '<=', filters.maxScoville)
    }

    if (filters.inStock !== undefined) {
      query.where('in_stock', filters.inStock)
    }

    if (filters.search) {
      // search => Red Pepper => red Pepper => все будет норм так как ILike регистронезависимый
      query.whereILike('name', `%${filters.search}%`)
    }

    const sortColumnMap: Record<ProductsOrderColumnsEnum, string> = {
      [ProductsOrderColumnsEnum.name]: 'name',
      [ProductsOrderColumnsEnum.slug]: 'slug',
      [ProductsOrderColumnsEnum.description]: 'description',
      [ProductsOrderColumnsEnum.price]: 'price',
      [ProductsOrderColumnsEnum.scoville]: 'scoville',
      [ProductsOrderColumnsEnum.inStock]: 'in_stock',
    }
    const sortColumn = filters.sortBy ? sortColumnMap[filters.sortBy] : 'updated_at'
    query.orderBy(sortColumn, order)
    // Вторичная сортировка по уникальному id — стабилизирует порядок при одинаковых
    // значениях в основной колонке, иначе строки "переезжают" между страницами (дубли на стыке)
    query.orderBy('id', order)

    const products = await query.paginate(page, perPage)

    return response.ok(products)
  }
}